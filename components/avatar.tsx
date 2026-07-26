import { Image, StyleSheet } from 'react-native';

type AvatarProps = {
  imageUrl: string;
  size?: number;
};

export default function Avatar({
  imageUrl,
  size = 48,
}: AvatarProps) {
  return (
    <Image
      accessibilityLabel="User profile"
      source={{ uri: imageUrl }}
      resizeMode="cover"
      style={[
        styles.image,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E2E8F0',
    borderWidth: 1.2,
    borderColor: '#D7E0E8',
    elevation: 4,
  },
});