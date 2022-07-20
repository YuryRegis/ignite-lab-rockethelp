import React, { useState, useEffect } from "react";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useRoute } from "@react-navigation/native";
import { IOrderFirestoreDTO } from "../DTOs/orderDTO";
import { CardDetails } from "../components/CardDetails";
import Firestore from "@react-native-firebase/firestore";
import { VStack, useTheme, HStack, Text, ScrollView } from "native-base";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  Clipboard,
} from "phosphor-react-native";

import { dateFormat } from "../utils";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
interface IRouteParams {
  orderId: string;
}

type IOrderDetails = IOrderFirestoreDTO & {
  id: string;
  description: string;
  solution: string;
  closed: string;
  when: string;
};

export function Details() {
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<IOrderDetails>({} as IOrderDetails);

  const { colors } = useTheme();
  const { params } = useRoute();
  const { orderId } = params as IRouteParams;

  useEffect(() => {
    Firestore()
      .collection<IOrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const data = doc.data();
        setOrder({
          id: doc.id,
          description: data.description,
          patrimony: data.patrimony,
          solution: data.solution,
          status: data.status,
          closed: data.closed,
          when: data.createdAt ? dateFormat(data.createdAt) : "",
        } as IOrderDetails);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} py={6} bg="gray.700">
      <Header title="Solicitação" />

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "close" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          ml={2}
          fontSize="sm"
          textTransform={"uppercase"}
          color={
            order.status === "close" ? colors.green[300] : colors.secondary[700]
          }
        >
          {order.status ? "Fechado" : "Em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          description={`Patrimônio: ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />

        <CardDetails
          title="Descrição do Problema"
          description={order.description}
          icon={Clipboard}
          footer={order.when}
        />

        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          <Input
            h={24}
            multiline
            bg="gray.600"
            textAlignVertical="top"
            onChangeText={setSolution}
            placeholder="Descrição da solução"
          />
        </CardDetails>
      </ScrollView>

      {!order.closed && (
        <Button title="Encerrar solicitação" onPress={() => {}} m={5} />
      )}
    </VStack>
  );
}
