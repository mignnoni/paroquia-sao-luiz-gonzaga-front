import { Heading as ChakraHeading, HStack, Icon, StackProps } from '@chakra-ui/react';
import { ReactElement } from 'react';

interface PageHeadingProps extends StackProps {
    icon: ReactElement;
}

export function PageHeading({ children, icon, ...rest }: React.PropsWithChildren<PageHeadingProps>) {
    return (
        <HStack gap={4} align={'center'} {...rest}>
            <Icon fontSize={'3xl'} color={'brand.400'}>
                {icon}
            </Icon>
            <ChakraHeading fontSize={['xl', '3xl']}>{children}</ChakraHeading>
        </HStack>
    );
}
