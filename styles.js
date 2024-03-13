import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      },
    chipContainer: {
      gap: 20,
      flex: 1,
      flexDirection: "row",
      justifyContent: "center"
    },
    chips: {
      width: 150,
      opacity: 80
    },
    scrollable: {
      height: "80%",
      padding: 10
    },
    outerCard: {
      padding: 5,
      height: "95%",
      maxWidth: 420
    },
    excCard: {
      padding: 5,
      marginTop: 10,
      marginBottom: 10,
      width: 400
    },
  
    titleText: {
      //fontWeight: 700,
      fontSize: 32,
      padding: 5,
      margin: 10
    },
  
    types: {
        marginTop: 15,
        marginBottom: 15
    },
    lastInput: {
        marginBottom: 20
    },
    calendar: {
        marginBottom: 20,
        width: 400
    },
    settingsText: {
        textAlign: "center"
    },
    settingsButton: {
        width: 200,
        margin: 0
    },
    settingsContainer: {
        marginTop: 75,
        flex: 1,
        alignItems: "center"
    }
  });