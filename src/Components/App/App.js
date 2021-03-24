import React from 'react'

import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchResults: [],
      playlistName: "My Playlist Name",
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track)
    let search = this.state.searchResults
    search.splice(search.indexOf(track), 1)
    this.setState({
      playlistTracks: tracks,
      searchResults: search
    })
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)

    this.setState({
      playlistTracks: tracks
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      const res = searchResults.filter((array_el) => 
        this.state.playlistTracks.filter((anotherOne_el) => 
          anotherOne_el.id === array_el.id ).length === 0)
      this.setState({
        searchResults: res
      })
    })
  }

  render() {
    const { searchResults, playlistName, playlistTracks } = this.state

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={searchResults} 
                onAdd={this.addTrack} />
            <Playlist playlistName={playlistName} 
                playlistTracks={playlistTracks} 
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
