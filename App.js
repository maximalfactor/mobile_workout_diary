import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  ScrollView, Text, View, StyleSheet } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider, Chip, Card, IconButton, SegmentedButtons, TextInput, Button } from 'react-native-paper';
import { useContext, createContext, useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
const styleImport = require("./styles")
const styles = {...styleImport.default};
const Stack = createNativeStackNavigator();
const excerciseContext = createContext([]);
export default function App() {
  const [excercises, setExcercises] = useState([]);
  const [unit, setUnit] = useState("km");
  return (
    <PaperProvider theme={CustomTheme}>
      <excerciseContext.Provider value={[excercises, setExcercises, unit, setUnit]}>
        <NavigationContainer >    
          <Stack.Navigator initialRouteName="ExcerciseScreen"> 
            <Stack.Screen name="ExcerciseScreen" component={ExcerciseScreen} />
            <Stack.Screen name="AddExcercise" component={AddExcercise} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </excerciseContext.Provider>
    </PaperProvider>
  );
}

function ExcerciseScreen({navigation}) {
  const context = useContext(excerciseContext)
  function SettingsButton() {
    return(
      <IconButton icon="cog" onPress={() => navigation.navigate("SettingsScreen")}></IconButton>
    )
  }
  
  function AddButton() {
    return(
      <IconButton icon="plus-thick" onPress={() => navigation.navigate("AddExcercise")}></IconButton>
    )
  }
  useEffect(
    () => {
      navigation.setOptions({"headerLeft": () => <AddButton />, "headerRight": () => <SettingsButton />, "title": "All Excercises"});
    }
  )
    
  if(context[0].length == 0) {
    
    return (
      <View style={styles.container}>
          <Text>Please add excercises</Text>
      </View>
    )
  }

  return (
  <View style={styles.container}>
    <Card style={styles.outerCard}>
      <ExcerciseTotal />
      <ScrollView style={styles.scrollable}>
        <PastExcerciseList />
      </ScrollView>
    </Card>
  </View>
  );
}

function ExcerciseTotal() {
  const context = useContext(excerciseContext);
  const excercises = context[0];
  if(!excercises) {
    <Text>Please add excercises</Text>
  }
  return(
    <View>
      <Text style={styles.titleText}>All Workouts</Text>
      <View style={styles.chipContainer}>
        <TotalIcons/>
      </View>
    </View>
  )
}

function TotalIcons() {
  const context = useContext(excerciseContext);
  const excercises = context[0];
  const unit = context[2];
  let totals = {};
  for (let excercise of excercises) {
    if(!(excercise[0] in totals)) {
      totals[excercise[0]] = excercise[1]
    }
    else {
      totals[excercise[0]] += excercise[1]
    }
  }
  return Object.entries(totals).map((exc) => 
    <Chip mode="outlined" style={styles.chips} icon={exc[0]} key={exc[0]}>{exc[1] + " " + unit}</Chip>
    )
}

function PastExcerciseList() {
  const context = useContext(excerciseContext);
  const excercises = context[0];
  const unit = context[2];

  return excercises.map((exc) =>
    <Card elevation={2} style={styles.excCard} key={excercises.indexOf(exc)}>
      <IconButton icon={exc[0]}></IconButton>
      <Text>{exc[2]}</Text>
      <Text>{"Duration: " + exc[3] + "min"}</Text>
      <Text>{"Distance: " + exc[1] + unit}</Text>
    </Card>
  )
}



function AddExcercise({navigation}) {
  const context = useContext(excerciseContext);
  const excercises = context[0];
  const setExcercises = context[1];
  const unit = context[2];
  const [excerciseType, setExcerciseType] = useState("");
  const [distance, setDistance] = useState("0");
  const [time, setTime] = useState("0");
  const [selectedDate, setDate] = useState("");

  function SettingsButton() {
    return(
      <IconButton icon="cog" onPress={() => navigation.navigate("SettingsScreen")}></IconButton>
    )
  }

  useEffect(
    () => {
      navigation.setOptions({"headerRight": () => <SettingsButton />, "title": "Add an Excercise"});
    }
  )

  function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }  //https://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
  function onSend() {
    console.log(distance, time)
    try {
      if(!excerciseType) {
        alert("Select excercise type")
        return
      }
      if(!(isNumber(distance) && isNumber(time))) {
        alert("Distance and time must be numbers")
        return
      };
      if(distance <= 0 || time <= 0) {
        alert("Distance or time non-positive")
        return
      }
      setExcercises([...excercises, [excerciseType, Number(distance), selectedDate, Number(time)]]);
      console.log(excercises)
    }
    catch {
      alert("Something went wrong")
    }
  }

  

  return (
        <View style={styles.container}>
          <Card style={styles.outerCard}>
            <TypeSelector typeSetter={setExcerciseType}/>
            <TextInput value={distance} onChangeText={(txt) => setDistance(txt)} label = {"Distance " + "(" + unit + ")"}></TextInput>
            <TextInput style={styles.lastInput} value={time} onChangeText={(txt) => setTime(txt)} label = {"Duration (min)"}></TextInput>
            <Calendar style={styles.calendar} onDayPress={(day) => setDate(day.dateString)} markedDates={{[selectedDate]: {selected: true, marked: true, selectedDotColor: 'blue'}}}/>
            <Button mode="contained" onPress={onSend}>Add Excercise</Button>
          </Card>
        </View>
        
    )
}

function TypeSelector({typeSetter}) {
  const [selectedValue, setValue] = useState();
  return (
    <SegmentedButtons style={styles.types} value={selectedValue} onValueChange={(value) => {setValue(value); typeSetter(value)}} buttons={
      [
        {
          icon: "walk", value: "walk", label: "Run"
        },
        {
          icon: "bike", value: "bike", label: "Bike"
        },
        {
          icon: "swim", value: "swim", label: "Swim"
        }
      ]
    }/>

    
  )
}

function SettingsScreen({navigation}) {
  const context = useContext(excerciseContext);
  const excercises = context[0];
  const unit = context[2];
  const setUnit = context[3];

  useEffect(
    () => {
      navigation.setOptions({"title": "Settings"});
    }
  )

  let conversionValue = 0;
  function onChange() {

    if(unit=="km") {
      setUnit("mile");
      conversionValue = 0.6213712;
    }
    else {
      setUnit("km");
      conversionValue = 1.609344;
    }

    for (let excercise of excercises) {                   //this might cause the value to change after repeatedly changing the unit
      excercise[1] *= conversionValue
      excercise[1] = Math.round(excercise[1] * 10) / 10
    };
  }
  return (
    <View style={styles.settingsContainer}>
      <Text style={[styles.titleText, styles.settingsText]}>Current unit is: {unit}</Text>
      <Button style={styles.settingsButton} mode="contained" onPress={onChange}>Change To: {unit=="km" ? "mile" : "km"}</Button>
    </View>
  )
}

CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#D28518",
    secondaryContainer: "#FFF0DD",
    elevation: {
      ...DefaultTheme.colors.elevation,
      level1: "#EFECF5"
    }
    
  }
}


