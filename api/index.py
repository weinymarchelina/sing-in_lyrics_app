import json
import logging
import os
import time
import spotipy
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
    print("hoedy")
    auth_url = create_spotify_oauth().get_authorize_url()
    return redirect(auth_url)

@app.route("/api/redirect")
def redirect_page():
    print("hey\n\n")
    session.clear()
    code = request.args.get("code")
    token_info = create_spotify_oauth().get_access_token(code)
    session[TOKEN_INFO] = token_info
    return redirect(url_for('get_current_track', _external=True))

@app.route("/api/getCurrentTrack")
def get_current_track():
    try: 
        token_info = get_token()
    except:
        print('User not logged in')
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    print("test main")
    current_playing_track =  sp.current_user_playing_track()
    album_info = current_playing_track['item']['album']
    artist_info = current_playing_track['item']['artists']

    print(current_playing_track)

    """
    current_playing_track_display = {
        'id': current_playing_track['id'],
        'name': current_playing_track['name'],
        'album_id': album_info['id'],
        'album_img': album_info['images'],
        'album_name': album_info['name'],
        'artist_id': artist_info['id'],
        'artist_name': artist_info['name']
    }

    print(current_playing_track_display)
    """

    return ("User's current track is returned successfully.")


@app.route("/api/getCurrentLyric")

@app.route("/api/getLibrary")
def get_library():
    try: 
        token_info = get_token()
    except:
        print('User not logged in')
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    print("test aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    user_playlists = sp.current_user_playlists(limit=5)
    # playlist_display_data = []

    for playlist in user_playlists['items']:
        selected_playlist = {
            'id': playlist['id'],
            'images': playlist['images'],
            'name': playlist['name'],
            'tracks': playlist['tracks']
        }
        print(selected_playlist)
        # playlist_display_data.append(selected_playlist)

    return "User's library is returned successfully."

    """
    user_playlists =  sp.current_user_playlists()
    user_saved_albums = sp.current_user_saved_albums()
    # user_saved_tracks = sp.current_user_saved_tracks()['items']

    print(user_playlists)
    print(user_saved_albums)
    """

    return ("User's library is returned successfully.")


@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

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