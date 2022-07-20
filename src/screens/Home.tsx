import React, { Alert } from "react-native";
import {
  HStack,
  IconButton,
  useTheme,
  VStack,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import auth from "@react-native-firebase/auth";
import Logo from "../assets/logo_secondary.svg";
import { IOrder, Order } from "../components/Order";
import { ChatTeardropText, SignOut } from "phosphor-react-native";

export function Home() {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const [statusSelected, setStatusSelected] = useState<"open" | "close">(
    "open"
  );
  const [orders, setOrders] = useState<IOrder[]>([
    {
      id: "123",
      patrimony: "3219876",
      when: "18/07/2022 às 09:00",
      status: "open",
    },
  ]);

  function handleNewOrder() {
    navigate("New");
  }

  function handleOpenDetails(order: IOrder) {
    navigate("Details", { orderId: order.id });
  }

  function handleSignOut() {
    auth()
      .signOut()
      .catch((_) => {
        return Alert.alert("SignOut", "Não foi possível sair.");
      });
  }

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleSignOut}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Solicitações</Heading>

          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="em andamento"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            type="close"
            title="finalizados"
            onPress={() => setStatusSelected("close")}
            isActive={statusSelected === "close"}
          />
        </HStack>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Order data={item} onPress={() => handleOpenDetails(item)} />
          )}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text textAlign="center" color="gray.200" fontSize="xl" mt={6}>
                Você ainda não possui{"\n"}solicitações{" "}
                {statusSelected === "open" ? "abertas" : "finalizadas"}
              </Text>
            </Center>
          )}
        />

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
