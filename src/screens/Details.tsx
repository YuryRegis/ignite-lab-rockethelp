import React, { useState, useEffect } from "react";

import { Alert } from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useNavigation, useRoute } from "@react-navigation/native";
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
  const { goBack } = useNavigation();

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
          closed: data.closedAt ? dateFormat(data.closedAt) : "",
          when: data.createdAt ? dateFormat(data.createdAt) : "",
        } as IOrderDetails);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Loading />;

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe uma solução para fechar a solicitação."
      );
    }
    Firestore()
      .collection<IOrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        solution,
        status: "close",
        closedAt: Firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada com sucesso.");
      })
      .catch((_) => {
        Alert.alert("Solicitação", "Erro ao encerrar a solicitação.");
      })
      .finally(() => goBack());
  }

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
          description={order.solution}
          icon={CircleWavyCheck}
          footer={order.status === "close" && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              h={24}
              multiline
              bg="gray.600"
              textAlignVertical="top"
              onChangeText={setSolution}
              placeholder="Descrição da solução"
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button title="Encerrar solicitação" onPress={handleOrderClose} m={5} />
      )}
    </VStack>
  );
}
