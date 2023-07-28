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
    print("please login")
    auth_url = create_spotify_oauth().get_authorize_url()
    return redirect(auth_url)

@app.route("/api/redirect")
def redirect_page():
    print("redirecting...")
    session.clear()
    code = request.args.get("code")
    token_info = create_spotify_oauth().get_access_token(code)
    session[TOKEN_INFO] = token_info
    return redirect(url_for('get_current_track', _external=True))

@app.route("/api/getCurrentTrack")
def get_current_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    current_playing_track =  sp.current_user_playing_track()['item']

    if current_playing_track is None:
        return("nothing is played")

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

    print(current_playing_track_data)

    return (f"User's current track is returned successfully: {current_playing_track_data}")

@app.route("/api/playTrack")
def play_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.start_playback()

    return("Track is played!")

@app.route("/api/pauseTrack")
def pause_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.pause_playback()

    return("Track is paused!")

@app.route("/api/nextTrack")
def next_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.next_track()

    return("Playing next track!")

@app.route("/api/previousTrack")
def previous_track():
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    sp.previous_track()

    return("Playing previous track!")

@app.route("/api/getCurrentLyric")

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

    print(tracks_list)

    return f"User's saved tracks of page is {current_page} returned successfully: {tracks_list}"

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

    playlist_list = []

    for playlist in user_playlists:
        playlist_data = {
            'id': playlist['id'],
            'images': playlist['images'],
            'name': playlist['name'],
            'total_tracks': playlist['tracks']['total']
        }

        playlist_list.append(playlist_data)

    print(playlist_list)

    return f"User's playlist of page {current_page} is returned successfully: {playlist_list}"

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

    print(album_data)

    return f"User's saved album of page {current_page} is returned successfully: {album_data}"

@app.route("/api/lyric/<track_id>")
def get_track_info(track_id):
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    track_info = sp.track(track_id)

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

    print(track_info_data)

    return(f"Track data and lyric successfully being returned: {track_info_data}")

@app.route("/api/playlist/<playlist_id>")
def get_playlist_tracks(playlist_id):
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    playlist_info = sp.playlist(playlist_id, additional_types=["track"])

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

    print(tracks_list)

    return f"User's playlist {playlist_name}'s tracks returned successfully: {tracks_list}"

@app.route("/api/album/<album_id>")
def get_album_tracks(album_id):
    token_info = handle_token_info()
    if not token_info:
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])

    album_info = sp.album(album_id)

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

    print(tracks_list)

    return(f"Track data of album {album_name} successfully being returned: {tracks_list}")

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
    
    return f"{user_data}"

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

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

# app.run()