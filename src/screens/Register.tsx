import React, { useState } from "react";

import { Alert } from "react-native";
import { VStack } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import Firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [patrimony, setPatrimony] = useState("");

  const { goBack } = useNavigation();

  function handleNewOrder() {
    if (!description || !patrimony) {
      return Alert.alert("Atenção!", "Preencha todos os campos");
    }
    setIsLoading(true);
    Firestore()
      .collection("orders")
      .add({
        patrimony,
        description,
        status: "open",
        createdAt: Firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Sucesso!", "Solicitação criada com sucesso.");
        setIsLoading(false);
      })
      .catch((_) => {
        Alert.alert("Erro!", "Erro ao criar solicitação.");
        setIsLoading(false);
      })
      .finally(() => goBack());
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />

      <Input
        placeholder="Numero do patrimônio"
        onChangeText={setPatrimony}
        mt={4}
      />

      <Input
        placeholder="Descrição do problema"
        onChangeText={setDescription}
        textAlignVertical="top"
        multiline
        flex={1}
        mt={5}
      />

      <Button
        onPress={handleNewOrder}
        isLoading={isLoading}
        title="Cadastrar"
        mt={5}
      />
    </VStack>
  );
}
