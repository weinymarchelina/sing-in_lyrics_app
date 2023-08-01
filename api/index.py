import io
import os
import re
import time
import spotipy
import requests
import pinyin_jyutping_sentence
from PIL import Image
from dragonmapper import hanzi
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, request, url_for, session, redirect, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import colorgram
load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SESSION_COOKIE_NAME'] = "Spotify Cookie"
app.secret_key = os.getenv("SECRET_KEY")
TOKEN_INFO = "token_info"

error_not_found = "The page you are looking for is not found."
success_action_done = "Action done."

@app.route("/api")
def login():
    auth_url = create_spotify_oauth().get_authorize_url()
    return redirect(auth_url)

@app.route("/api/redirect")
def redirect_page():
    session.clear()

    code = request.args.get("code")
    token_info = create_spotify_oauth().get_access_token(code)
    session[TOKEN_INFO] = token_info

    return redirect("http://localhost:3000/library?token=" + token_info["access_token"])

@app.route("/api/getCurrentTrack", methods=["GET"])
def get_current_track():
    token = request.cookies.get("access_token")

    redirect_response = {
        'redirect_user': True,
    }

    if not token:
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

    response = {
        'current_track': current_playing_track_data,
        'next_track': next_track_info_data
    }

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

@app.route("/api/getSavedTrack", methods=["GET"])
def get_saved_track():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    current_page = int(request.args.get('page', 1))
    limit = 20
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

    try:
        track_info = sp.track(track_id)
    except Exception:
        return error_not_found

    track_album = track_info['album']

    track_artist_list = []

    for artists_item in track_info['artists']:
        artist_data = {
            'name': artists_item['name'],
            'id': artists_item['id'],
        }

        track_artist_list.append(artist_data)

    track_info_data = {
        'id': track_info['id'],
        'name': track_info['name'],
        'album_id': track_album['id'],
        'album_img': track_album['images'],
        'album_name': track_album['name'],
        'artists': track_artist_list,
    }

    #

    name_list = [track_info['name'], track_album['name']]

    for artists_item in track_info['artists']:
        name_list.append(artists_item['name'])

    track_phonetics_data = get_phonetics(name_list)

    #

    lyric_url = f"https://spotify-lyric-api.herokuapp.com/?trackid={track_id}"

    lyric_response = requests.get(lyric_url)

    lyric_data = {}
    is_lyric_available = True

    if lyric_response.status_code != 200:
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
        'bg_color': bg_color,
        'text_color': text_color,
        'preference': preference
    }

    return full_data

@app.route("/api/playlist/<playlist_id>", methods=["GET"])
def get_playlist_tracks(playlist_id):
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    try:
        playlist_info = sp.playlist(playlist_id, additional_types=["track"])
    except Exception:
        return error_not_found

    playlist_name = playlist_info['name']
    playlist_img = playlist_info['images']
    playlist_total_tracks = playlist_info['tracks']['total']
    playlist_tracks = playlist_info['tracks']['items']

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

    playlist_data = {
        'track_list': track_list,
        'name': playlist_name,
        'img': playlist_img,
        'total_tracks': playlist_total_tracks
    }

    return playlist_data

@app.route("/api/album/<album_id>", methods=["GET"])
def get_album_tracks(album_id):
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    try:
        album_info = sp.album(album_id)
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

    album_data = {
        'track_list': track_list,
        'name': album_name,
        'img': album_img,
        'total_tracks': album_total_tracks
    }

    return album_data

@app.route("/api/profile", methods=["GET"])
def get_profile():
    token = request.cookies.get("access_token")

    if not token:
        return None 

    sp = spotipy.Spotify(auth=token)

    user_info = sp.current_user()
    user_top_artists = sp.current_user_top_artists(limit=10, time_range='short_term')['items']
    user_top_tracks = sp.current_user_top_tracks(limit=10, time_range='short_term')['items']

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
            'album_img': tracks_info['album']['images'],
            'id': tracks_info['id'],
            'name': tracks_info['name'],
            'popularity': tracks_info['popularity'],
            'artists': tracks_artists
        }

        track_list.append(tracks_info)

    user_data = {
        'name': user_info['display_name'],
        'img': user_info['images'],
        'top_artists': artists_list,
        'top_tracks': track_list
    }
    
    return user_data

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("CLIENT_ID"),
        client_secret=os.getenv("CLIENT_SECRET"),
        redirect_uri=url_for("redirect_page", _external=True),
        scope="user-library-read user-read-currently-playing user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative user-top-read"
    )

@app.route('/api/getCookie', methods=["GET"])
def set_cookie():
    """
    response = make_response("Cookie set successfully")
    token = request.args.get('code', "empty!")
    response.set_cookie("access_token", token, httponly=True)
    """
    token = request.args.get('token', None)
    response = make_response("Cookie set successfully")
    response.set_cookie("access_token", token, httponly=True)

    return response

@app.route('/api/logout', methods=["GET"])
def logout():
    response = make_response(redirect("http://localhost:3000/"))
    # response.set_cookie("access_token", "", httponly=True)
    response.delete_cookie("access_token")

    return response

@app.route('/api/checkToken', methods=["GET"])
def check_token():
    token = request.cookies.get("access_token")

    redirect_response = {
        'is_auth': False,
        'is_checked': False
    }

    if token:
        try:
            sp = spotipy.Spotify(auth=token)
            user = sp.current_user()

            redirect_response['is_checked'] = True
            
            if user:
                redirect_response['is_auth'] = True
                
        except Exception as err:
            print(err)

    return redirect_response 

@app.route('/api/setPreference', methods=["GET"])
def set_preference():
    preference = request.args.get('preference', None)
    response = make_response("Preference set successfully")
    response.set_cookie('preference', preference, httponly=True)
    return response

def add_spaces_to_parentheses_and_brackets(text):
    characters_to_add_spaces = "()<>《》[]『』「」（）.～？！"
    
    for char in characters_to_add_spaces:
        text = text.replace(char, f" {char} ")
    
    return text

def split_words(word):
    pattern = r"([\u4e00-\u9fff]+|[\u3100-\u312F]+|[a-zA-Z]+|[\uac00-\ud7af]+|[ぁ-ゔ]+|[ァ-ヴー]+|[一-龠]+)"  
    word_list = re.findall(pattern, word)
    return word_list

def convert_to_pinyin_jyutping(word):
    if ('\u4e00' <= word <= '\u9fff'):
        pinyin = pinyin_jyutping_sentence.pinyin(word, spaces=True)
        jyutping = pinyin_jyutping_sentence.jyutping(word, spaces=True).replace("妳", "něi").replace("喔", "āk").replace("涙", "leoi").replace("綑", "kwán")
    else:
        pinyin = word
        jyutping = word

    return pinyin, jyutping

def hanzi_converter(line):
    words = line.split(" ")
    zhuyin_list = []
    pinyin_list = []
    jyutping_list = []
    original_list = []
    
    for word in words:
        if ('\u4e00' <= word <= '\u9fff'):
            splitted_word_list = split_words(word)
            cleaned_word = ' '.join(splitted_word_list)

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

            zhuyin_list.append(zhuyin)
            pinyin_list.append(pinyin)
            jyutping_list.append(jyutping)
            original_list.append(cleaned_word)
            
        else:
            zhuyin_list.append(word)
            pinyin_list.append(word)
            jyutping_list.append(word)
            original_list.append(word)
           
    return zhuyin_list, pinyin_list, jyutping_list, original_list

def get_phonetics(lines_list):
    zhuyin_list = []
    pinyin_list = []
    jyutping_list = []
    original_list = []

    for line in lines_list:
        cleaned_line = add_spaces_to_parentheses_and_brackets(line)
        zhuyin, pinyin, jyutping, original = hanzi_converter(cleaned_line)
        zhuyin_list.append(zhuyin)
        pinyin_list.append(pinyin)
        jyutping_list.append(jyutping)
        original_list.append(original)

    phonetics_list = {
        'zhuyin': zhuyin_list,
        'pinyin': pinyin_list,
        'jyutping': jyutping_list,
        'original': original_list
    }

    return phonetics_list

def rgb_to_hex(rgb_tuple):
    r, g, b = rgb_tuple
    return "#{:02x}{:02x}{:02x}".format(r, g, b)

def text_color_based_on_background_hex(background_hex):
    # Convert hex color to RGB
    hex_color = background_hex.lstrip("#")
    rgb = tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))

    # Calculate brightness from RGB values
    r, g, b = rgb
    brightness = (0.299 * r) + (0.587 * g) + (0.114 * b)

    # Define the brightness threshold for choosing text color
    brightness_threshold = 130

    # Choose text color based on background brightness
    if brightness < brightness_threshold:
        return "#EEEEEE"
    else:
        return "#202020"

def get_album_color(image_link):
    response = requests.get(image_link)
    image = Image.open(io.BytesIO(response.content))

    palette = colorgram.extract(image, 5)

    palette.sort(key=lambda c: c.hsl.h)

    # print(palette)

    for color in palette:
        print(color.hsl)

    matched_hex_color_list = [rgb_to_hex(color.rgb) for color in palette]

    # print(matched_hex_color_list)

    filtered_hex = []

    for color in  matched_hex_color_list:
        dark_shades = (not color[1].isalpha()) and (
            int(color[1]) < 3 
        )

        light_shades = (color[1].isalpha()) 

        if not dark_shades and not light_shades:
            filtered_hex.append(color)

    # print(filtered_hex)

    bg_color = matched_hex_color_list[2]

    if filtered_hex:
        bg_color = filtered_hex[-1]

    text_color = text_color_based_on_background_hex(bg_color)

    # print(bg_color)
    # print(text_color)

    return bg_color, text_color

# get_album_color("https://i.scdn.co/image/ab67616d0000b2730a020a0296b97e6c8f4def97")


    


    