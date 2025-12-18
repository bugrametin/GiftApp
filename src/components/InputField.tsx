import colors from "@src/theme/colors";
import spacing from "@src/theme/spacing";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";


export default function InputField({
  label,
  ...props
}: { label: string } & TextInputProps) {
  const multiline = !!props.multiline;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.muted} // Placeholder color
        style={[styles.input, multiline && styles.multiline, props.style]} // Combines base + multiline + custom styles
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md, // Space under each input block
  },
  label: {
    color: colors.muted, // Label color
    marginBottom: spacing.xs, // Space between label and input
    fontSize: 13, // Label font size
  },
  input: {
    backgroundColor: colors.card, // Input background
    borderColor: colors.border, // Input border color
    borderWidth: 1, // Input border thickness
    padding: spacing.md, // Input inner padding
    borderRadius: 12, // Input corner radius
    color: colors.text, // Input text color
    fontSize: 15, // Input text size
  },
  multiline: {
    minHeight: 90, // Multiline height
    textAlignVertical: "top", // Text starts at top
  },
});
