import os
import time
import json
import spotipy
import requests
import pinyin_jyutping_sentence
from dragonmapper import transcriptions
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, request, url_for, session, redirect
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['SESSION_COOKIE_NAME'] = "Spotify Cookie"
app.secret_key = os.getenv("SECRET_KEY")
TOKEN_INFO = "token_info"

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

    return redirect("http://localhost:3000/library")

@app.route("/api/getCurrentTrack")
def get_current_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    current_playing_track =  sp.current_user_playing_track()['item']

    if current_playing_track is None:
        return json.dumps({})

    current_playing_album = current_playing_track['album']
    current_playing_artists_list = []

    for artists_item in current_playing_track['artists']:
        artist_data = {
            'name': artists_item['name'],
            'id': artists_item['id'],
        }

        current_playing_artists_list.append(artist_data)

    current_playing_track_data = {
        'id': current_playing_track['id'],
        'name': current_playing_track['name'],
        'album_id': current_playing_album['id'],
        'album_img': current_playing_album['images'],
        'album_name': current_playing_album['name'],
        'artists': current_playing_artists_list
    }

    return json.dumps(current_playing_track_data)

@app.route("/api/playTrack")
def play_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.start_playback()

    return json.dumps({ 'message': "Action done."})

@app.route("/api/pauseTrack")
def pause_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.pause_playback()

    return json.dumps({ 'message': "Action done."})

@app.route("/api/nextTrack")
def next_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.next_track()

    return json.dumps({ 'message': "Action done."})

@app.route("/api/previousTrack")
def previous_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.previous_track()

    return json.dumps({ 'message': "Action done."})

@app.route("/api/getSavedTrack")
def get_saved_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    current_page = int(request.args.get('page', 1))
    limit = 20
    offset = limit * (current_page - 1)

    user_tracks = sp.current_user_saved_tracks(limit=limit, offset=offset)['items']

    if not user_tracks:
        return json.dumps({'message': "The page you are looking for is not found."})

    tracks_list = []

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
            'artist': track_artists_list,
            'name': track_item['track']['name'],
            'id': track_item['track']['id'],
            'duration': track_item['track']['duration_ms'],
            'popularity': track_item['track']['popularity']
        }

        tracks_list.append(track_data)

    return json.dumps(tracks_list)

@app.route("/api/getPlaylist")
def get_playlist():
    try: 
        token_info = get_token()
    except:
        print('User not logged in')
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    current_page = int(request.args.get('page', 1))
    limit = 20
    offset = limit * (current_page - 1)

    user_playlists = sp.current_user_playlists(limit=limit, offset=offset)['items']

    if not user_playlists:
        return json.dumps({'message': "The page you are looking for is not found."})

    playlist_list = []

    for playlist in user_playlists:
        playlist_data = {
            'id': playlist['id'],
            'images': playlist['images'],
            'name': playlist['name'],
            'total_tracks': playlist['tracks']['total']
        }

        playlist_list.append(playlist_data)

    return json.dumps(playlist_list)

@app.route("/api/getSavedAlbum")
def get_saved_album():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    current_page = int(request.args.get('page', 1))
    limit = 20
    offset = limit * (current_page - 1)

    user_albums = sp.current_user_saved_albums(limit=limit, offset=offset)['items']

    if not user_albums:
        return json.dumps({'message': "The page you are looking for is not found."})

    album_data = []

    for album_item in user_albums:
        artists_list = []

        for artists_item in album_item['album']['artists']:
            artist_data = {
                'name': artists_item['name'],
                'id': artists_item['id'],
            }

            artists_list.append(artist_data)

        selected_album = {
            'id': album_item['album']['id'],
            'images': album_item['album']['images'],
            'name': album_item['album']['name'],
            'artists': artists_list,
        }

        album_data.append(selected_album)

    return json.dumps(album_data)

@app.route("/api/lyric/<track_id>")
def get_track_info(track_id):
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    try:
        track_info = sp.track(track_id)
    except Exception:
        return json.dumps({'message': "The page you are looking for is not found."})

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

    full_data = {
        'track': track_info_data,
        'is_lyric_available': is_lyric_available,
        'lyric': lyric_data
    }

    return json.dumps(full_data)

@app.route("/api/playlist/<playlist_id>")
def get_playlist_tracks(playlist_id):
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    try:
        playlist_info = sp.playlist(playlist_id, additional_types=["track"])
    except Exception:
        return json.dumps({'message': "The page you are looking for is not found."})

    playlist_name = playlist_info['name']
    playlist_img = playlist_info['images']
    playlist_total_tracks = playlist_info['tracks']['total']
    playlist_tracks = playlist_info['tracks']['items']

    tracks_list = []

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
            'artist': track_artists_list,
            'name': track_item['track']['name'],
            'id': track_item['track']['id'],
            'duration': track_item['track']['duration_ms'],
            'popularity': track_item['track']['popularity']
        }

        tracks_list.append(track_data)

    playlist_data = {
        'tracks': tracks_list,
        'name': playlist_name,
        'img': playlist_img,
        'total_tracks': playlist_total_tracks
    }

    return json.dumps(playlist_data)

@app.route("/api/album/<album_id>")
def get_album_tracks(album_id):
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    try:
        album_info = sp.album(album_id)
    except Exception:
        return json.dumps({'message': "The page you are looking for is not found."})
    
    album_name = album_info['name']
    album_img = album_info['images']
    album_total_tracks = album_info['tracks']['total']
    album_tracks = album_info['tracks']['items']

    tracks_list = []

    for track_item in album_tracks:
        track_artists_list = []

        for artists_item in track_item['artists']:
            artist_data = {
                'name': artists_item['name'],
                'id': artists_item['id'],
            }

            track_artists_list.append(artist_data)

        track_data = {
            'artist': track_artists_list,
            'name': track_item['name'],
            'id': track_item['id'],
            'duration': track_item['duration_ms'],
        }

        tracks_list.append(track_data)

    album_data = {
        'tracks': tracks_list,
        'name': album_name,
        'img': album_img,
        'total_tracks': album_total_tracks
    }

    return json.dumps(album_data)

@app.route("/api/profile")
def get_profile():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    user_info = sp.current_user()
    user_top_artists = sp.current_user_top_artists(limit=10, time_range='short_term')['items']
    user_top_tracks = sp.current_user_top_tracks(limit=10, time_range='short_term')['items']

    artists_list = []
    tracks_list = []

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
            'artist': tracks_artists
        }

        tracks_list.append(tracks_info)

    user_data = {
        'name': user_info['display_name'],
        'img': user_info['images'],
        'top_artists': artists_list,
        'top_tracks': tracks_list
    }
    
    return json.dumps(user_data)

def handle_token_info():
    try: 
        token_info = get_token()
    except:
        print('User not logged in')
        return None
    
    return token_info

def get_token():
    token_info = session.get(TOKEN_INFO, None)
    if not token_info:
        redirect(url_for('login', _external=False))

    current_time = int(time.time())

    is_expired = token_info['expires_at'] - current_time < 60
    if (is_expired):
        spotify_oauth = create_spotify_oauth()
        token_info = spotify_oauth.refresh_access_token(token_info['refresh_token'])

    return token_info

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("CLIENT_ID"),
        client_secret=os.getenv("CLIENT_SECRET"),
        redirect_uri=url_for("redirect_page", _external=True),
        scope="user-library-read user-read-currently-playing user-modify-playback-state playlist-read-private playlist-read-collaborative user-top-read"
    )

def hanzi_converter(line):
    words = line.split(" ")
    zhuyin_list = []
    pinyin_list = []
    jyutping_list = []
    original_list = []

    for word in words:
        if ('\u4e00' <= word <= '\u9fff'):
            pinyin = pinyin_jyutping_sentence.pinyin(word, spaces=True)
            jyutping = pinyin_jyutping_sentence.jyutping(word, spaces=True).replace("妳", "něi")

            try: 
                zhuyin = transcriptions.pinyin_to_zhuyin(pinyin)
            except:
                print(f"{word} is unreadable as zhuyin")

                if '哦' in word:
                    zhuyin = word.replace('哦', 'ㄜˊ')
                else:
                    zhuyin = word
            
            zhuyin_list.append(zhuyin)
            pinyin_list.append(pinyin)
            jyutping_list.append(jyutping)
            original_list.append(word)
        else:
            print(f"Not hanzi: {word}")

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
        zhuyin, pinyin, jyutping, original = hanzi_converter(line)
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