import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Text } from '@/components/Text';
import { QueueItem } from './QueueItem';
import { FlatList, Pressable, useColorScheme } from 'react-native';
import { GetInitialQueue } from './StartBeeping';
import { ResultOf } from 'gql.tada';
import { View } from 'react-native';
import { Status } from '@/utils/types';
import { useRef } from 'react';
import { isWeb } from '@/utils/constants';

interface Props {
  beeps: ResultOf<typeof GetInitialQueue>['getQueue'];
  onRefresh: () => void;
  refreshing: boolean;
}

export function Queue(props: Props) {
  const { beeps, onRefresh, refreshing } = props;
  const colorScheme = useColorScheme();

  const ref = useRef<BottomSheet>(null);

  const hasUnacceptedBeep = beeps.some(beep => beep.status === Status.WAITING);

  const List = isWeb ? FlatList : BottomSheetFlatList;

  return (
    <BottomSheet
      ref={ref}
      snapPoints={["10%", "50%", "100%"]}
      backgroundStyle={colorScheme === "dark" ? { backgroundColor: "#1c1c1c" } : {}}
      handleIndicatorStyle={colorScheme === "dark" ? { backgroundColor: "white" } : {}}
    >
      <Pressable className="px-4 pb-4 justify-between flex-row" onPress={() => ref.current?.expand()}>
        <Text size="3xl" weight="black">Queue</Text>
        {hasUnacceptedBeep && <View className="rounded-full bg-blue-400 w-4 h-4 animate-pulse" />}
      </Pressable>
      <List
        data={beeps}
        keyExtractor={(beep) => beep.id}
        renderItem={({ item, index }) => (
          <QueueItem item={item} index={index} />
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        className="px-2"
        contentContainerStyle={{ gap: 4 }}
        ListEmptyComponent={<Text className="px-2">If more riders join your queue, they will show here!</Text>}
      />
    </BottomSheet>
  );
}
