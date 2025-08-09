import { Box, Flex, HStack, Image } from '@chakra-ui/react';
import { ColorModeButton, useColorMode } from '../ui/color-mode';
import { Profile } from './Profile';
import { Menu } from './Menu';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const { colorMode } = useColorMode();
    const navigate = useNavigate();

    return (
        <Flex
            as={'header'}
            w="full"
            h={20}
            bg={{ base: 'white', _dark: 'gray.900' }}
            justify={'space-between'}
            align={'center'}
            pl={5}
            pr={8}
            shadow={'sm'}
            zIndex={50}
        >
            <Menu />
            <Box onClick={() => navigate('/')}>
                <Image src={colorMode == 'dark' ? '/logo.png' : '/logo-light.png'} maxH={[6, 8, 9]} />
            </Box>
            <HStack gap={4}>
                <ColorModeButton rounded={'full'} />
                <Profile />
            </HStack>
        </Flex>
    );
}
