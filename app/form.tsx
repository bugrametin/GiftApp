import PrimaryButton from "@src/components/PrimaryButton";
import type { GiftFormPayload } from "@src/services/recommender";
import colors from "@src/theme/colors";
import spacing from "@src/theme/spacing";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import InputField from "../src/components/InputField";

export default function GiftForm() {
  const router = useRouter();

  const [name, setName] = useState(""); // Recipient name
  const [age, setAge] = useState(""); // Age
  const [relationship, setRelationship] = useState("friend"); // Relationship
  const [occasion, setOccasion] = useState("birthday"); // Occasion
  const [budget, setBudget] = useState(""); // Budget
  const [interests, setInterests] = useState(""); // Interests
  const [avoid, setAvoid] = useState(""); // Avoid/dislikes
  const [notes, setNotes] = useState(""); // Notes

  const payload: GiftFormPayload = useMemo(
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
      Alert.alert("Missing", "Please enter a valid age."); // Validation alert
      return;
    }
    if (!budget || Number.isNaN(Number(budget))) {
      Alert.alert("Missing", "Please enter a valid budget (TRY)."); // Validation alert
      return;
    }

    router.push({
      pathname: "/results",
      params: { form: JSON.stringify(payload) }, // Passes payload to results
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === "ios" ? "padding" : undefined} // Avoids keyboard overlap on iOS
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gift Details</Text>

        <InputField label="Recipient name (optional)" value={name} onChangeText={setName} placeholder="E.g., Ahmet" />
        <InputField label="Age" value={age} onChangeText={setAge} placeholder="E.g., 24" keyboardType="numeric" />
        <InputField
          label="Relationship"
          value={relationship}
          onChangeText={setRelationship}
          placeholder="friend / partner / family / coworker"
        />
        <InputField
          label="Occasion"
          value={occasion}
          onChangeText={setOccasion}
          placeholder="birthday / anniversary / graduation / new job"
        />
        <InputField label="Budget (TRY)" value={budget} onChangeText={setBudget} placeholder="E.g., 1000" keyboardType="numeric" />
        <InputField label="Interests (comma separated)" value={interests} onChangeText={setInterests} placeholder="coffee, gym, books..." />
        <InputField label="Avoid / dislikes" value={avoid} onChangeText={setAvoid} placeholder="no perfume, no clothes..." />
        <InputField label="Notes" value={notes} onChangeText={setNotes} placeholder="Anything else?" multiline />

        <PrimaryButton label="Find gifts" onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1, // Fill screen height
    backgroundColor: colors.bg, // Background color
  },
  container: {
    padding: spacing.lg, // Page padding
    paddingBottom: spacing.xxl, // Extra bottom spacing
    backgroundColor: colors.bg, // Background color
  },
  title: {
    fontSize: 22, // Title size
    fontWeight: "800", // Title weight
    color: colors.text, // Title color
    marginBottom: spacing.lg, // Space under title
  },
});
