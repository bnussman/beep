import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card, Layout, Text } from '@ui-kitten/components';
import { GetRateDataQuery } from '../generated/graphql';
import ProfilePicture from './ProfilePicture';

export const GetRateData = gql`
query GetRateData {
    getLastBeepToRate {
        id
        beeper {
            id
            name
            username
            photoUrl
        }
    }
}
`;

interface Props {
    navigation: any;
}

export function RateCard(props: Props) {

    const { data, loading, error, refetch } = useQuery<GetRateDataQuery>(GetRateData, { fetchPolicy: 'no-cache' });

    if (loading || !data?.getLastBeepToRate) return null;

    return (
        <Card
            style={{ width: "85%", marginBottom: 12 }}
            onPress={() => {
                props.navigation.navigate("Rate", {
                    id: data?.getLastBeepToRate?.beeper.id,
                    user: data?.getLastBeepToRate?.beeper,
                    beep: data?.getLastBeepToRate?.id
                });
            }
        }>
            <Text category='h5'>Rate Your Last Beeper:</Text>
            <Layout style={{flexDirection: 'row', marginHorizontal: -16}}>
                {data?.getLastBeepToRate?.beeper.photoUrl &&
                <ProfilePicture
                    style={{marginHorizontal: 8}}
                    size={35}
                    url={data.getLastBeepToRate.beeper.photoUrl}
                />
                }
                <Layout>
                    <Text category='h6'>
                        {data?.getLastBeepToRate?.beeper.name}
                    </Text>
                    <Text
                        appearance='hint'
                        category='s1'>
                        {data?.getLastBeepToRate?.beeper.username}
                    </Text>
                </Layout>
            </Layout>
        </Card>
    );
}
