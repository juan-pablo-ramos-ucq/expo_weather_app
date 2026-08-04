import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';



type ProfileSheetProps = {
  visible: boolean;
  onClose: () => void; // specifies the callback type received from the parent—in this case with no arguments or return value.
  imageUrl: string;
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ProfileSheet({
  visible,
  onClose,
  imageUrl,
}: ProfileSheetProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <Pressable
          onPress={onClose}
          style={StyleSheet.absoluteFill} //absoluteFill - take the whole width and height of the parent
        />

        <View style={styles.sheet}>
          <Pressable
            onPress={onClose}
            style={styles.close}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <Image source={{ uri: imageUrl }} style={styles.avatar} />
          <Text style={styles.name}>Alex Rivera</Text>
          <Text style={styles.subtitle}>WeatherScope Member</Text>

          <View style={styles.details}>
            <Detail label="FULL NAME" value="Alex Rivera" />
            <Detail label="EMAIL" value="alex.rivera@weatherscope.app" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', //Places its child—the sheet—at the bottom of the screen.
    backgroundColor: 'rgba(20, 24, 30, 0.45)',
  },
  sheet: {
    minHeight: '62%',
    alignItems: 'center',
    paddingHorizontal: 34,
    paddingTop: 34,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  close: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  closeText: {
    marginTop: -8,
    color: '#64748B',
    fontSize: 30,
    fontWeight: '300',
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 6,
    borderColor: '#E7EDF3',
  },
  name: {
    marginTop: 14,
    color: '#0F172A',
    fontSize: 25,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 17,
  },
  details: {
    width: '100%',
    gap: 14,
    marginTop: 36,
  },
  detail: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  detailValue: {
    marginTop: 5,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
