import { Box, HStack, Image, IconButton, Text, VStack } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";

interface ImageThumbnailsProps {
  files: File[];
  onRemove: (file: File) => void;
  maxWidth?: string;
  maxHeight?: string;
}

export function ImageThumbnails({
  files,
  onRemove,
  maxWidth = "120px",
  maxHeight = "120px",
}: ImageThumbnailsProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <VStack align="start" gap={3} w="full">
      <Text
        fontSize="sm"
        fontWeight="medium"
        color="gray.600"
        _dark={{ color: "gray.300" }}
      >
        Imagens carregadas ({files.length})
      </Text>
      <HStack gap={3} flexWrap="wrap">
        {files.map((file, index) => (
          <Box
            key={`${file.name}-${index}`}
            position="relative"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            overflow="hidden"
            bg="white"
            _dark={{
              borderColor: "gray.600",
              bg: "gray.800",
            }}
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              maxW={maxWidth}
              maxH={maxHeight}
              objectFit="cover"
            />
            <IconButton
              position="absolute"
              top={1}
              right={1}
              size="xs"
              colorScheme="red"
              aria-label="Remover imagem"
              onClick={() => onRemove(file)}
              opacity={0.8}
              _hover={{ opacity: 1 }}
            >
              <LuX size={12} />
            </IconButton>
          </Box>
        ))}
      </HStack>
    </VStack>
  );
}
