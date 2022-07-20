import React, { useState } from "react";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { VStack, Heading, Icon, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";

import Logo from "../assets/logo_primary.svg";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("João");
  const [password, setPassword] = useState("");

  const { colors } = useTheme();

  function handleSignIn() {
    if (!name || !password) {
      return Alert.alert("Auth", "Preencha todos os campos");
    }
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(name, password)
      .catch(({ code }) => {
        if (!code) return Alert.alert("Error", "Erro desconhecido.");
        const response = code.split("/");
        const title = response[0];
        const message = response[1].split("-").join(" ");
        Alert.alert(title, message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setName}
      />

      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        w="full"
        title="Entrar"
        isLoading={loading}
        onPress={handleSignIn}
      />
    </VStack>
  );
}
