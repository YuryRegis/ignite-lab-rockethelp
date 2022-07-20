import React, { ReactNode } from "react";

import { IconProps } from "phosphor-react-native";
import { HStack, VStack, Text, Box, useTheme } from "native-base";

interface ICardDetailsProps {
  title: string;
  description?: string;
  icon: React.ElementType<IconProps>;
  footer?: string;
  children?: ReactNode;
}

export function CardDetails({
  title,
  description,
  icon: Icon,
  footer,
  children,
}: ICardDetailsProps) {
  const { colors } = useTheme();

  return (
    <VStack bg="gray.600" p={5} mt={4} rounded="sm">
      <HStack alignItems="center" mb={4}>
        <Icon color={colors.primary[700]} />
        <Text textTransform="uppercase" color="gray.300" fontSize="sm" ml={2}>
          {title}
        </Text>
      </HStack>

      {!!description && (
        <Text color="gray.100" fontSize="md">
          {description}
        </Text>
      )}

      {children}

      {!!footer && (
        <Box borderColor="gray.400" borderTopWidth={1} mt={3}>
          <Text mt={3} color="gray.300" fontSize="sm">
            {footer}
          </Text>
        </Box>
      )}
    </VStack>
  );
}
