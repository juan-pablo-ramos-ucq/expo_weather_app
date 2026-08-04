import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Header from './header';
import ProfileSheet from './ProfileSheet';

const dummyUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format";

export default function Home() {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
      <>
        <Header dummyUrl={dummyUrl} onOpen={() => setProfileOpen(true)}/>
        <ProfileSheet
          imageUrl={dummyUrl}
          onClose={() => setProfileOpen(false)}
          visible={profileOpen}
        />
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});
