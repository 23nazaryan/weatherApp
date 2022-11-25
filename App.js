import React from "react";
import * as Location from "expo-location"
import Loading from "./Loading";
import {Alert} from "react-native";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = 'd4336fcba94012bf71d6966cf1a90299'

export default class  extends React.Component {
    state = {
        isLoading: true,
        temp: 23,
        condition: 'Clear'
    }

    getWeather = async (lat, lon) => {
        const {data: {main: {temp}, weather}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

        this.setState({
            isLoading: false,
            temp: temp,
            condition: weather[0].main
        })
    }

    getLocation = async () => {
        try {
            await Location.requestForegroundPermissionsAsync()
            const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync()
            await this.getWeather(latitude, longitude)
        } catch (error) {
            Alert.alert('Не могу определить местоположение', 'Очень грустно :(')
        }
    }

    componentDidMount() {
        this.getLocation()
    }

    render() {
        const {isLoading, temp, condition} = this.state

        return (
            isLoading ? <Loading/> : <Weather temp={Math.round(temp)} condition={condition} />
        );
    }
}
