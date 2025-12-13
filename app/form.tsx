import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from "react-native";

export default function GiftForm() {
  const router = useRouter();

  const [name, setName] = useState(""); // Recipient name
  const [age, setAge] = useState(""); // Age
  const [relationship, setRelationship] = useState("friend"); // Relationship
  const [occasion, setOccasion] = useState("birthday"); // Occasion
  const [budget, setBudget] = useState(""); // Budget TRY
  const [interests, setInterests] = useState(""); // Interests
  const [avoid, setAvoid] = useState(""); // Avoid/dislikes
  const [notes, setNotes] = useState(""); // Notes

  const payload = useMemo(
    () => ({
      name,
      age: Number(age),
      relationship,
      occasion,
      budget: Number(budget),
      interests,
      avoid,
      notes,
    }),
    [name, age, relationship, occasion, budget, interests, avoid, notes]
  );

  function submit() {
    if (!age || Number.isNaN(Number(age))) {
      Alert.alert("Missing", "Please enter a valid age.");
      return;
    }
    if (!budget || Number.isNaN(Number(budget))) {
      Alert.alert("Missing", "Please enter a valid budget (TRY).");
      return;
    }

    router.push({
      pathname: "/results",
      params: { form: JSON.stringify(payload) },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === "ios" ? "padding" : undefined} // Avoids keyboard overlap on iOS
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gift Details</Text>

        <Label text="Recipient name (optional)" />
        <Input value={name} onChangeText={setName} placeholder="E.g., Ahmet" />

        <Label text="Age" />
        <Input value={age} onChangeText={setAge} placeholder="E.g., 24" keyboardType="numeric" />

        <Label text="Relationship" />
        <Input value={relationship} onChangeText={setRelationship} placeholder="friend / partner / family / coworker" />

        <Label text="Occasion" />
        <Input value={occasion} onChangeText={setOccasion} placeholder="birthday / anniversary / graduation / new job" />

        <Label text="Budget (TRY)" />
        <Input value={budget} onChangeText={setBudget} placeholder="E.g., 1000" keyboardType="numeric" />

        <Label text="Interests (comma separated)" />
        <Input value={interests} onChangeText={setInterests} placeholder="coffee, gym, books..." />

        <Label text="Avoid / dislikes" />
        <Input value={avoid} onChangeText={setAvoid} placeholder="no perfume, no clothes..." />

        <Label text="Notes" />
        <Input value={notes} onChangeText={setNotes} placeholder="Anything else?" multiline />

        <Pressable onPress={submit} style={styles.btn}>
          <Text style={styles.btnText}>Find gifts</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

function Input(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#9AA4B2" // Placeholder color
      style={[styles.input, props.multiline && styles.multiline]} // Multiline styling
    />
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1, // Fills screen height
    backgroundColor: "#0B0F14", // Page background color
  },
  container: {
    padding: 18, // Page padding
    paddingBottom: 32, // Extra bottom space
    backgroundColor: "#0B0F14", // Background color
  },
  title: {
    fontSize: 22, // Title size
    fontWeight: "800", // Title weight
    color: "#E8EEF7", // Title color
    marginBottom: 18, // Space below title
  },
  label: {
    color: "#9AA4B2", // Label color
    marginBottom: 6, // Space under label
    fontSize: 13, // Label font size
  },
  input: {
    backgroundColor: "#121826", // Input background
    borderColor: "#233044", // Input border color
    borderWidth: 1, // Input border thickness
    padding: 14, // Input inner padding
    borderRadius: 12, // Input corner radius
    color: "#E8EEF7", // Input text color
    fontSize: 15, // Input text size
    marginBottom: 14, // Space under input
  },
  multiline: {
    minHeight: 90, // Multiline height
    textAlignVertical: "top", // Text starts at top
  },
  btn: {
    backgroundColor: "#4F8CFF", // Button background color
    paddingVertical: 14, // Button vertical padding
    borderRadius: 14, // Button corner radius
    alignItems: "center", // Centers button text
    marginTop: 8, // Space above button
  },
  btnText: {
    color: "white", // Button text color
    fontWeight: "800", // Button text weight
    fontSize: 16, // Button text size
  },
});
