import io
import os
import re
import time
import random
import spotipy
import requests
import colorgram
import pinyin_jyutping_sentence
from PIL import Image
from gtts import gTTS
from dragonmapper import hanzi
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, request, url_for, session, redirect, make_response
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__)
CORS(app)

app.config['SESSION_COOKIE_NAME'] = "Spotify Cookie"
app.secret_key = os.getenv("SECRET_KEY")
base_url = os.getenv("BASE_URL")
TOKEN_INFO = "token_info"

error_not_found = "The page you are looking for is not found."
success_action_done = "Action done."

@app.route("/api")
def login():
    auth_url = create_spotify_oauth().get_authorize_url()
    redirect(auth_url)
    return redirect(auth_url)

@app.route("/api/redirect")
def redirect_page():
    session.clear()

    code = request.args.get("code")
    token_info = create_spotify_oauth().get_access_token(code)

    return redirect(f"{base_url}/library?token={token_info['access_token']}&refresh_token={token_info['refresh_token']}&expires_at={token_info['expires_at']}")

@app.route('/api/checkToken', methods=["GET"])
def check_token():
    token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    expires_at = request.cookies.get("expires_at")

    redirect_response = {
        'is_auth': False,
        'is_checked': False
    }

    new_token_info = {}

    if token:
        try:
            current_time = int(time.time())
            is_expired = int(expires_at) - current_time < 60

            if (is_expired):
                new_token_info = refresh_access_token(refresh_token)
                redirect_response['is_checked'] = True
                redirect_response['is_auth'] = True
                
            else:
                sp = spotipy.Spotify(auth=token)
                user = sp.current_user()

                redirect_response['is_checked'] = True

                if user:
                    redirect_response['is_auth'] = True
                
        except Exception as err:
            print(err)


    response = make_response(redirect_response)

    if new_token_info != {}:
        response.set_cookie("access_token", new_token_info['access_token'], httponly=True)
        response.set_cookie("refresh_token", new_token_info['refresh_token'], httponly=True)
        response.set_cookie("expires_at", str(new_token_info['expires_at']), httponly=True)

    return response 

@app.route('/api/getCookie', methods=["POST"])
def set_cookie():
    data = request.get_json()
    auth_data = data.get('auth_data', {})
    response = make_response("Cookie set successfully")
    response.set_cookie("access_token", auth_data['token'], httponly=True)
    response.set_cookie("refresh_token", auth_data['refresh_token'], httponly=True)
    response.set_cookie("expires_at", auth_data['expires_at'], httponly=True)

    return response

@app.route('/api/logout', methods=["GET"])
def logout():
    response = make_response(redirect(f"{base_url}/"))
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    response.delete_cookie("expires_at")

    return response

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("CLIENT_ID"),
        client_secret=os.getenv("CLIENT_SECRET"),
        redirect_uri=url_for("redirect_page", _external=True),
        scope="user-library-read user-read-currently-playing user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative user-top-read"
    )

def refresh_access_token(refresh_token):
    spotify_oauth = create_spotify_oauth()
    token_info = spotify_oauth.refresh_access_token(refresh_token)
    return {
        'access_token': token_info['access_token'],
        'refresh_token': token_info['refresh_token'],
        'expires_at': token_info['expires_at']
    }


#

@app.route("/api/getCurrentTrack", methods=["GET"])
def get_current_track():
    token = request.cookies.get("access_token")

    redirect_response = {
        'redirect_user': True,
    }

    new_token_info = {}

    if not token:
        return redirect_response
    else:
        try:
            refresh_token = request.cookies.get("refresh_token")
            expires_at = request.cookies.get("expires_at")

            current_time = int(time.time())
            is_expired = int(expires_at) - current_time < 60
            if (is_expired):
                new_token_info = refresh_access_token(refresh_token)
        except Exception as err:
            print(err)
            return redirect_response


    sp = None
    current_player = None
    next_tracks_list = None

    try:
        sp = spotipy.Spotify(auth=token)
        current_player =  sp.current_user_playing_track()
        next_tracks_list =  sp.queue()['queue']
    except Exception as err:
        print(err)
        return redirect_response

    #

    is_playing = current_player['is_playing']
    current_playing_track = current_player['item']

    if current_playing_track is None:
        return "empty"

    current_playing_album = current_playing_track['album']
    current_playing_artists_list = []

    for artists_item in current_playing_track['artists']:
        artist_data = {
            'name': artists_item['name'],
            'id': artists_item['id'],
        }

        current_playing_artists_list.append(artist_data)

    #

    if not next_tracks_list:
        return "empty"
    
    next_track = next_tracks_list[0]

    next_track_artist_list = []

    for artists_item in next_track['artists']:
        artist_data = {
            'name': artists_item['name'],
            'id': artists_item['id'],
        }

        next_track_artist_list.append(artist_data)

    next_track_info_data = {
        'id': next_track['id'],
        'name': next_track['name'],
        'album_img': next_track['album']['images'],
        'artists': next_track_artist_list,
    }

    current_playing_track_data = {
        'id': current_playing_track['id'],
        'name': current_playing_track['name'],
        'album_id': current_playing_album['id'],
        'album_img': current_playing_album['images'],
        'album_name': current_playing_album['name'],
        'artists': current_playing_artists_list,
        'is_playing': is_playing,
    }

    response_data = {
        'current_track': current_playing_track_data,
        'next_track': next_track_info_data
    }

    response = make_response(response_data)

    if new_token_info != {}:
        response.set_cookie("access_token", new_token_info['access_token'], httponly=True)
        response.set_cookie("refresh_token", new_token_info['refresh_token'], httponly=True)
        response.set_cookie("expires_at", str(new_token_info['expires_at']), httponly=True)

    return response

@app.route("/api/playTrack", methods=["GET"])
def play_track():
    token = request.cookies.get("access_token")

    if not token:
        return None 
    
    sp = spotipy.Spotify(auth=token)

    sp.start_playback()

    time.sleep(0.5)

    return get_current_track()

@app.route("/api/pauseTrack", methods=["GET"])
def pause_track():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    sp.pause_playback()

    time.sleep(0.5)

    return get_current_track()

@app.route("/api/nextTrack", methods=["GET"])
def next_track():
    token = request.cookies.get("access_token")

    if not token:
        return None 
    
    sp = spotipy.Spotify(auth=token)

    sp.next_track()

    time.sleep(0.5)

    return get_current_track()

@app.route("/api/previousTrack", methods=["GET"])
def previous_track():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    sp.previous_track()

    time.sleep(0.5)

    return get_current_track()

#

@app.route("/api/getSavedTrack", methods=["GET"])
def get_saved_track():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    current_page = int(request.args.get('page', 1))
    limit = 50
    offset = limit * (current_page - 1)

    response_data = sp.current_user_saved_tracks(limit=limit, offset=offset)
    
    user_tracks = response_data['items']

    if not user_tracks:
        return error_not_found

    track_list = []

    for track_item in user_tracks:
        track_album = track_item['track']['album']

        track_artists_list = []

        for artists_item in track_item['track']['artists']:
            artist_data = {
                'name': artists_item['name'],
                'id': artists_item['id'],
            }

            track_artists_list.append(artist_data)

        track_data = {
            'album_img': track_album['images'],
            'album_id': track_album['id'],
            'album_name': track_album['name'],
            'artists': track_artists_list,
            'name': track_item['track']['name'],
            'id': track_item['track']['id'],
            'duration': track_item['track']['duration_ms'],
            'popularity': track_item['track']['popularity']
        }

        track_list.append(track_data)

    is_next_page = True
    if not response_data['next']:
        is_next_page = False

    response_data = {
        'is_next_page': is_next_page,
        'track_list': track_list
    }

    return response_data

@app.route("/api/getPlaylist", methods=["GET"])
def get_playlist():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    current_page = int(request.args.get('page', 1))
    limit = 20
    offset = limit * (current_page - 1)

    user_playlists_data = sp.current_user_playlists(limit=limit, offset=offset)
    
    user_playlists = user_playlists_data['items']

    if not user_playlists:
        return error_not_found

    playlist_list = []

    for playlist in user_playlists:
        playlist_list.append({
            'id': playlist['id'],
            'img': playlist['images'],
            'name': playlist['name'],
            'total_tracks': playlist['tracks']['total']
        })

    is_next_page = True
    if not user_playlists_data['next']:
        is_next_page = False

    response_data = {
        'is_next_page': is_next_page,
        'playlist_list': playlist_list,
    }

    return response_data

@app.route("/api/getSavedAlbum", methods=["GET"])
def get_saved_album():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    current_page = int(request.args.get('page', 1))
    limit = 20
    offset = limit * (current_page - 1)

    saved_albums_data = sp.current_user_saved_albums(limit=limit, offset=offset)
    
    user_albums = saved_albums_data['items']

    if not user_albums:
        return error_not_found

    album_data = []

    for album_item in user_albums:
        artists_list = []

        for artists_item in album_item['album']['artists']:
            artist_data = {
                'name': artists_item['name'],
                'id': artists_item['id'],
            }

            artists_list.append(artist_data)

        album_data.append({
            'id': album_item['album']['id'],
            'img': album_item['album']['images'],
            'name': album_item['album']['name'],
            'artists': artists_list,
        })

    is_next_page = True
    if not saved_albums_data['next']:
        is_next_page = False

    response_data = {
        'is_next_page': is_next_page,
        'album_data': album_data,
    }

    return response_data

@app.route("/api/lyric/<track_id>", methods=["GET"])
def get_track_lyric(track_id):
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    redirect_to_current = False

    track_artist_list = []

    try:
        if track_id == "current":
            track_info = sp.current_user_playing_track()['item']
        else:
            status = request.args.get('status', None)
            if (status == 'next'):
                current_track_id = sp.current_user_playing_track()['item']['id']

                if current_track_id == track_id:
                    redirect_to_current = True

            if not redirect_to_current:
                track_info = sp.track(track_id)

        if not redirect_to_current:
            for artists_item in track_info['artists']:
                artist_img = sp.artist(artists_item['id'])['images']
                artist_data = {
                    'name': artists_item['name'],
                    'id': artists_item['id'],
                    'img': artist_img
                }

                track_artist_list.append(artist_data)
    except Exception:
        return error_not_found
    

    if redirect_to_current:
        return {
            'redirect': True
        }
    
    
    updated_track_id = track_info['id']

    track_album = track_info['album']

    track_info_data = {
        'id': track_info['id'],
        'name': track_info['name'],
        'album_id': track_album['id'],
        'album_img': track_album['images'],
        'album_name': track_album['name'],
        'artists': track_artist_list,
    }

    #

    track_info_list = [track_info['name'], track_album['name']]
    track_phonetics_data = get_phonetics(track_info_list)

    track_artist_name_list = []
    for artists_item in track_info['artists']:
        track_artist_name_list.append(artists_item['name'])
    track_artist_phonetics_data = get_phonetics(track_artist_name_list)
    

    #

    lyric_url = f"{os.getenv('SPOTIFY_LYRIC_API')}{updated_track_id}"


    lyric_response = requests.get(lyric_url)

    lyric_data = {}
    is_lyric_available = True


    if lyric_response.json()['error'] == True:
        is_lyric_available = False
    else:
        lines_list = []

        for line in lyric_response.json()['lines']:
            lines_list.append(line['words'])

        lyric_data = get_phonetics(lines_list)


    #

    album_img_url = track_album['images'][0]['url']
    bg_color, text_color = get_album_color(album_img_url)

    #

    preference = request.cookies.get("preference")
    valid_preference_list = ['pinyin', 'jyutping', 'zhuyin', 'original']
    valid_preference = False

    for phonetics in valid_preference_list:
        if phonetics == preference:
            valid_preference = True
    
    if not preference or not valid_preference:
        preference = "pinyin"

    #

    full_data = {
        'track': track_info_data,
        'is_lyric_available': is_lyric_available,
        'lyric': lyric_data,
        'track_phonetics': track_phonetics_data,
        'artist_phonetics': track_artist_phonetics_data,
        'bg_color': bg_color,
        'text_color': text_color,
        'preference': preference,
        'redirect' : False
    }

    return full_data

@app.route("/api/playlist/<playlist_id>", methods=["GET"])
def get_playlist_tracks(playlist_id):
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)
    
    current_page = int(request.args.get('page', 1))
    limit = 50
    offset = limit * (current_page - 1)

    try:
        playlist_info = sp.playlist(playlist_id, additional_types=["track"])
        response_data = sp.playlist_tracks(playlist_id, limit=limit, offset=offset, additional_types=["track"])
    except Exception as err:
        print(err)
        return error_not_found

    playlist_tracks = response_data['items']
    playlist_name = playlist_info['name']
    playlist_img = playlist_info['images']
    playlist_total_tracks = playlist_info['tracks']['total']

    track_list = []

    for track_item in playlist_tracks:
        track_album = track_item['track']['album']

        track_artists_list = []

        for artists_item in track_item['track']['artists']:
            artist_data = {
                'name': artists_item['name'],
                'id': artists_item['id'],
            }

            track_artists_list.append(artist_data)

        track_data = {
            'album_img': track_album['images'],
            'album_id': track_album['id'],
            'album_name': track_album['name'],
            'artists': track_artists_list,
            'name': track_item['track']['name'],
            'id': track_item['track']['id'],
            'duration': track_item['track']['duration_ms'],
            'popularity': track_item['track']['popularity']
        }

        track_list.append(track_data)

    is_next_page = True
    if not response_data['next']:
        is_next_page = False

    album_img_url = playlist_img[0]['url']
    bg_color, text_color = get_album_color(album_img_url)

    playlist_data = {
        'track_list': track_list,
        'name': playlist_name,
        'img': playlist_img,
        'total_tracks': playlist_total_tracks,
        'is_next_page': is_next_page,
        'bg_color': bg_color,
        'text_color': text_color
    }

    return playlist_data

@app.route("/api/album/<album_id>", methods=["GET"])
def get_album_tracks(album_id):
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    album_artists_list = []

    try:
        album_info = sp.album(album_id)

        for album_artists_item in album_info['artists']:
            artist_img = sp.artist(album_artists_item['id'])['images']
            artist_data = {
                'name': album_artists_item['name'],
                'id': album_artists_item['id'],
                'img': artist_img
            }

            album_artists_list.append(artist_data)

            
    except Exception:
        return error_not_found

    album_name = album_info['name']
    album_img = album_info['images']
    album_total_tracks = album_info['tracks']['total']
    album_tracks = album_info['tracks']['items']

    track_list = []

    for track_item in album_tracks:
        track_artists_list = []

        for artists_item in track_item['artists']:
            artist_data = {
                'name': artists_item['name'],
                'id': artists_item['id'],
            }

            track_artists_list.append(artist_data)

        track_data = {
            'artists': track_artists_list,
            'name': track_item['name'],
            'id': track_item['id'],
            'duration': track_item['duration_ms'],
        }

        track_list.append(track_data)

    album_img_url = album_img[0]['url']
    bg_color, text_color = get_album_color(album_img_url)

    album_data = {
        'track_list': track_list,
        'base_album_info': {
            'name': album_name,
            'img': album_img,
            'artists': album_artists_list,
            'total_tracks': album_total_tracks
        },
        'bg_color': bg_color,
        'text_color': text_color
    }

    return album_data

@app.route("/api/profile", methods=["GET"])
def get_profile():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    user_info = sp.current_user()
    user_top_artists = sp.current_user_top_artists(limit=15, time_range='short_term')['items']
    user_top_tracks = sp.current_user_top_tracks(limit=50, time_range='short_term')['items']

    artists_list = []
    track_list = []

    for artist_item in user_top_artists:
        artist_info = {
            'id': artist_item['id'],
            'img': artist_item['images'],
            'name': artist_item['name'],
            'popularity': artist_item['popularity']
        }

        artists_list.append(artist_info)

    for tracks_info in user_top_tracks:
        tracks_artists = []

        for tracks_artists_item in tracks_info['artists']:
            tracks_artists_info = {
                'name': tracks_artists_item['name'],
                'id': tracks_artists_item['id']
            }

            tracks_artists.append(tracks_artists_info)

        tracks_info = {
            'img': tracks_info['album']['images'],
            'id': tracks_info['id'],
            'name': tracks_info['name'],
            'popularity': tracks_info['popularity'],
            'artists': tracks_artists
        }

        track_list.append(tracks_info)

    bg_color, text_color = get_album_color(user_info['images'][1]['url'])

    user_data = {
        'name': user_info['display_name'],
        'img': user_info['images'],
        'top_artists': artists_list,
        'top_tracks': track_list,
        'bg_color': bg_color,
        'text_color': text_color
    }
    
    return user_data

#


@app.route('/api/setPreference', methods=["GET"])
def set_preference():
    preference = request.args.get('preference', None)
    response = make_response("Preference set successfully")
    response.set_cookie('preference', preference, httponly=True)
    return response

@app.route('/api/getAudio', methods=["POST"])
def get_audio():
    data = request.get_json()
    audio_data_list = data.get('audio_data', [])
    audio_blob_list = generate_audio_files(audio_data_list)
    audio_response = b''.join(audio_blob_list)
    response = make_response(audio_response)
    response.headers['Content-Type'] = 'audio/mpeg'
    return response

#

def add_spaces_to_parentheses_and_brackets(text):
    characters_to_add_spaces = "()<>《》[]『』「」（）.～？！"
    
    for char in characters_to_add_spaces:
        text = text.replace(char, f" {char} ")
    
    return text

def split_chinese_english_words(word):
    pattern = r"([\u4e00-\u9fff]+|[\u3100-\u312F]+|[a-zA-Z]+|[\uac00-\ud7af]+|[ぁ-ゔ]+|[ァ-ヴー]+|[一-龠]+|\d+)"  
    word_list = re.findall(pattern, word)
    return word_list

def convert_to_pinyin_jyutping(word):
    if ('\u4e00' <= word <= '\u9fff'):
        pinyin = pinyin_jyutping_sentence.pinyin(word, spaces=True)

        if "都" in word:
            pinyin = pinyin.replace("dū", "dōu")

        if "強" in word:
            pinyin = pinyin.replace("jiàng", "qiáng")

        jyutping = pinyin_jyutping_sentence.jyutping(word, spaces=True).replace("妳", "něi").replace("喔", "āk").replace("涙", "leoi").replace("綑", "kwán")
    else:
        pinyin = word
        jyutping = word

    return pinyin, jyutping

def has_chinese_characters(word):
    for char in word:
        if '\u4e00' <= char <= '\u9fff':
            return True
    return False

def hanzi_converter(line):
    words = line.split(" ")
    zhuyin_list = []
    pinyin_list = []
    jyutping_list = []
    original_list = []
    
    for word in words:
        if (has_chinese_characters(word)):
            splitted_word_list = split_chinese_english_words(word) 
            cleaned_word = ' '.join(splitted_word_list) #

            splitted_zhuyin = []
            splitted_pinyin = []
            splitted_jyutping = []

            for splitted_word in splitted_word_list:
                pinyin = splitted_word
                jyutping = splitted_word
                zhuyin = splitted_word

                if ('\u4e00' <= splitted_word <= '\u9fff'):
                    pinyin, jyutping = convert_to_pinyin_jyutping(splitted_word)
                    
                    try: 
                        zhuyin = hanzi.to_zhuyin(splitted_word)
                    except:
                        char_list = []
                        for char in splitted_word:
                            try:
                                zhuyin_char = hanzi.to_zhuyin(char)
                            except:
                                zhuyin_char = char

                                oh_list = ['喔', '哦', '噢']
                                for oh in oh_list:
                                    if oh == char:
                                        zhuyin_char = 'ㄛˊ'
                                
                            char_list.append(zhuyin_char)
                    
                        zhuyin = ' '.join(char_list)

                splitted_pinyin.append(pinyin)
                splitted_jyutping.append(jyutping)
                splitted_zhuyin.append(zhuyin)
                
            pinyin = ' '.join(splitted_pinyin)
            jyutping = ' '.join(splitted_jyutping)
            zhuyin = ' '.join(splitted_zhuyin)

            zhuyin_list.append([zhuyin])
            pinyin_list.append([pinyin])
            jyutping_list.append([jyutping])
            original_list.append([cleaned_word])
            
        else:
            zhuyin_list.append([word])
            pinyin_list.append([word])
            jyutping_list.append([word])
            original_list.append([word])
           
    return zhuyin_list, pinyin_list, jyutping_list, original_list

def get_phonetics(lines_list):
    zhuyin_list = []
    pinyin_list = []
    jyutping_list = []
    original_list = []
    lyric_data = []

    for line in lines_list:
        cleaned_line = add_spaces_to_parentheses_and_brackets(line)
        zhuyin, pinyin, jyutping, original = hanzi_converter(cleaned_line)

        spaced_original = []
        for phrase_list in original:
            spaced_phrase_list = add_spacing_to_chinese_phrase(phrase_list)
            spaced_original.append(spaced_phrase_list)

        zhuyin_list.append(zhuyin)
        pinyin_list.append(pinyin)
        jyutping_list.append(jyutping)
        original_list.append(spaced_original)
        map_lyric = create_word_mapping(spaced_original, pinyin, zhuyin, jyutping)
        lyric_data.append(map_lyric)

    return lyric_data

#

def is_chinese(word):
    for char in word:
        if '\u4e00' <= char <= '\u9fff':
            return True
    return False

def create_word_pairs(hanzi_list, jyutping_list, pinyin_list, zhuyin_list):
    word_pairs = []

    for hanzi_word, jyutping_word, pinyin_word, zhuyin_word in zip(hanzi_list, jyutping_list, pinyin_list, zhuyin_list):
        if is_chinese(hanzi_word):
            hanzi_chars = hanzi_word.split()
            jyutping_chars = jyutping_word.split()
            pinyin_chars = pinyin_word.split()
            zhuyin_chars = zhuyin_word.split()
            word_pairs.extend(zip(hanzi_chars, jyutping_chars, pinyin_chars, zhuyin_chars))
        else:
            word_pairs.append([hanzi_word])

    return word_pairs

def tokenize_phrase(phrase_string):
    return phrase_string.split(' ')

def group_phrase(phrase_list):
    return [[word] for word in phrase_list]

def spacing_word(word):
    return ' '.join(word)

def add_spacing_to_chinese_phrase(phrase_list):
    def has_space(lst):
        return any(' ' in element for element in lst)

    result_list = []

    fixed_phrase_list = []

    for string_phrase in phrase_list:
        new_phrase = [string_phrase]

        if (has_space(string_phrase)):
            splitted_words = string_phrase.split(' ')
            new_phrase = splitted_words
        
        fixed_phrase_list.append(new_phrase)
        

    for fixed_phrase in fixed_phrase_list:
        new_fixed_phrase = []

        for word_string in fixed_phrase:
            spaced_word = word_string

            if is_chinese(word_string):
                spaced_word = spacing_word(word_string)

            word_string = spaced_word

            new_fixed_phrase.append(word_string)

        result_list.append(' '.join(new_fixed_phrase))

    return result_list

def create_word_mapping(hanzi_list, pinyin_list, zhuyin_list, jyutping_list):
    result = []
    for (hanzi_line, pinyin_line, zhuyin_line, jyutping_line) in zip(hanzi_list, pinyin_list, zhuyin_list, jyutping_list):

        new_line = []

        for (hanzi_phrase, pinyin_phrase, zhuyin_phrase, jyutping_phrase) in zip(hanzi_line, pinyin_line, zhuyin_line, jyutping_line):
            phrase_pair = []

            tokenized_h_p = tokenize_phrase(hanzi_phrase)
            tokenized_p_p = tokenize_phrase(pinyin_phrase)
            tokenized_z_p = tokenize_phrase(zhuyin_phrase)
            tokenized_j_p = tokenize_phrase(jyutping_phrase)

            for (hanzi_word, pinyin_word, zhuyin_word, jyutping_word) in zip(tokenized_h_p, tokenized_p_p, tokenized_z_p, tokenized_j_p):
                word_pair = [hanzi_word]

                if (hanzi_word != pinyin_word):
                    word_pair = [hanzi_word, pinyin_word, zhuyin_word, jyutping_word]
                
                phrase_pair.append(word_pair)
            
            new_line.append(phrase_pair)

        result.append(new_line)

    return result

#

def rgb_to_hex(rgb_tuple):
    r, g, b = rgb_tuple
    return "#{:02x}{:02x}{:02x}".format(r, g, b)

def text_color_based_on_background_hex(background_hex):
    hex_color = background_hex.lstrip("#")
    rgb = tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))

    r, g, b = rgb
    brightness = (0.299 * r) + (0.587 * g) + (0.114 * b)

    brightness_threshold = 130

    if brightness < brightness_threshold:
        return "#EEEEEE"
    else:
        return "#202020"

def get_album_color(image_link):
    response = requests.get(image_link)
    image = Image.open(io.BytesIO(response.content))

    palette = colorgram.extract(image, 7)

    palette.sort(key=lambda c: c.hsl.h)

    matched_hex_color_list = [rgb_to_hex(color.rgb) for color in palette]

    filtered_hex = []

    for color in  matched_hex_color_list:
        dark_shades = (not color[1].isalpha()) and (
            int(color[1]) < 3 
        )

        light_shades = (color[1].isalpha()) and (color[5].isalpha())

        if not dark_shades and not light_shades:
            filtered_hex.append(color)

    bg_color = random.choice(matched_hex_color_list)

    if filtered_hex:
        bg_color = random.choice(filtered_hex)

    text_color = text_color_based_on_background_hex(bg_color)

    return bg_color, text_color

#

def generate_audio_files(track_info_list):
    audio_files = []

    translation = {
        'album_name': "專輯 ",
        'artists': "歌手 ",
        'name': "歌名 "
    }

    for key, value in track_info_list.items():
        word_list = split_chinese_english_words(value)
        phrase = ' '.join(word_list)
        track_info_list[key] = f"{translation[key]} {phrase}"


    for info_string in track_info_list.values():
        tts = gTTS(text=info_string, lang='zh-tw')
        audio_file = io.BytesIO()
        tts.write_to_fp(audio_file)
        audio_file.seek(0)
        audio_files.append(audio_file.getvalue())

    return audio_files
