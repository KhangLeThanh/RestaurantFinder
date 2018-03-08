import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import Expo from 'expo';
import { MapView } from 'expo';
import Geocoder from 'react-native-geocoding';

Geocoder.setApiKey('AIzaSyDqt-OTdtIFwuRT09pOC-yNUOwHMXmSXFI'); // use a valid API key
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputText: '',
      latitude:61.9241,
      longitude:25.7482,
      places:null,
    }    
  }
  
  showResult = () =>{

    Geocoder.setApiKey('AIzaSyDqt-OTdtIFwuRT09pOC-yNUOwHMXmSXFI'); // use a valid API key 
    Geocoder.getFromLocation(this.state.inputText).then(
      json => {
        var location = json.results[0].geometry.location;
        this.setState({
          longitude:location.lng,
          latitude: location.lat
        })
        this.getPlaces();
      },
      error => {
        alert(error);
      }
      
    );  
  }

  getUrlWithPara =(lat,long,radius,type,API) =>{
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}&radius=${radius}`;
    const typeData = `&types=${type}`;
    const key = `&key=${API}`
    return `${url}${location}${typeData}${key}`

  }
  getPlaces = () =>{
    const url = this.getUrlWithPara(this.state.latitude,this.state.longitude,500,'restaurant','AIzaSyCsC9Uz5Q9sgsTyZ-HlGLxSB1f55SJRYrk')
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => { 
        const arrayMarkers = [];
        responseJson.results.map((element,i)=>{
          arrayMarkers.push(
            <MapView.Marker
              key={i}
              coordinate={{
                latitude:element.geometry.location.lat,
                longitude:element.geometry.location.lng,
              }}
              title= {element.name}
              description={element.vicinity}
            />
          )
        })
        this.setState({places:arrayMarkers});
      })
    .catch((error) => { 
      Alert.alert(error); 
    });  
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.latitude ?
        <MapView
            style={styles.map}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0322,
              longitudeDelta: 0.0221,
            }}>
               {this.state.places}
               
        </MapView>:null}
        <View style={styles.wrapperInput}>
            <TextInput style={styles.inputSearch}  onChangeText={(inputText) => this.setState({inputText})} value={this.state.inputText}/>
            <Button onPress={this.showResult} title="SHOW"/>
            <Text>{this.state.test}</Text>
        </View>          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 80,
  },
  wrapperInput:{
    flex:20
  },
  inputSearch:{
    height: 36,
    padding: 10,
    margin: 18,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#48BBEC',
    backgroundColor: 'rgba(0,0,0,0)',
  }
});
