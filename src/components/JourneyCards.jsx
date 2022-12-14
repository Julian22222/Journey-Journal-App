import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import useCollection from "../../utils/hooks/useCollection";
import { getAuth } from "firebase/auth";
import {
  deleteDoc,
  getDocs,
  doc,
  where,
  collection,
  query,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const JourneyCards = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const deleteJourney = async (id) => {
    console.log("deleted", id);

    try {
      await deleteDoc(doc(db, "Journey", id));

      const q = query(
        collection(db, "Accommodation"),
        where("journey_id", "==", id)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((singledoc) => {
        deleteDoc(doc(db, "Accommodation", singledoc.id)).then(() =>
          console.log("deleted", singledoc)
        );
      });

      const q1 = query(
        collection(db, "Catering"),
        where("journey_id", "==", id)
      );

      const querySnapshot1 = await getDocs(q1);
      querySnapshot1.forEach((singledoc) => {
        deleteDoc(doc(db, "Catering", singledoc.id)).then(() =>
          console.log("deleted")
        );
      });

      const q2 = query(
        collection(db, "Attractions"),
        where("journey_id", "==", id)
      );

      const querySnapshot2 = await getDocs(q2);
      querySnapshot2.forEach((singledoc) => {
        deleteDoc(doc(db, "Attractions", singledoc.id)).then(() =>
          console.log("deleted")
        );
      });
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  const Item = ({ id, city, title, date, endDate }) => (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{city}</Title>
          <Paragraph>{title}</Paragraph>
          <Paragraph>
            {new Date(date * 1000).toDateString()} -{" "}
            {new Date(endDate * 1000).toDateString()}
          </Paragraph>

          <Card.Cover
            source={{
              uri: "https://picsum.photos/id/10/700",
            }}
          />
          <Card.Actions>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                navigation.navigate("JourneyDetails", { id: id });
              }}
            >
              Journey Details
            </Button>

            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                deleteJourney(id);
              }}
            >
              Delete Journey
            </Button>
          </Card.Actions>
        </Card.Content>
      </Card>
    </View>
  );

  const { documents: trips } = useCollection("Journey", [
    "uid",
    "==",
    user.uid,
  ]);

  const renderItem = ({ item }) => (
    <Item
      city={item.city}
      title={item.journey_title}
      date={item.date.seconds}
      endDate={item.endDate.seconds}
      id={item.id}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default JourneyCards;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    alignItems: "center",
    backgroundColor: "",
  },

  button: {
    alignItems: "center",
  },
});
