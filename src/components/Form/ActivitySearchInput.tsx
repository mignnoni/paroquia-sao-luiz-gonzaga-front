import { Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { customScrollbar } from '@/styles/scrollbar';
import { useDebounce } from '@/utils/debounce';
import { activitySearchInputStore } from '@/stores/activitySearchInputStore';
import { Field } from '../ui/field';
import { IBaseActivity } from '@/interfaces/IBaseActivity';

interface SearchInputProps {
    errorText?: string;
    title?: string;
}

export function ActivitySearchInput({ errorText, title = 'Atividade' }: SearchInputProps) {
    const { setSearch, suggestions, isLoaded, selectedValue, setSelectedValue, resetSearch, setResetSearch } =
        activitySearchInputStore();

    const [show, setShow] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [selected, setSelected] = useState<boolean>(false);

    const debouncedInputValue = useDebounce(inputValue, 500);

    useEffect(() => {
        if (debouncedInputValue.trim() && !selected) {
            setSearch(debouncedInputValue);
            setSelectedValue(null);
            setShow(true);
        }
    }, [debouncedInputValue]);

    const handleSelect = (value: IBaseActivity) => {
        setSelected(true);
        setInputValue(value.name);
        setSelectedValue(value);
        setShow(false);
    };

    const handleChange = (value: string) => {
        setInputValue(value);
        setSelectedValue(null);
        setSelected(false);
    };

    const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            setSearch(ev.currentTarget.value);
            ev.preventDefault();
        }
    };

    const onBlur = () => {
        setTimeout(() => {
            setShow(false);
        }, 1000);
    };

    useEffect(() => {
        if (selectedValue) {
            handleSelect(selectedValue);
        }
    }, []);

    useEffect(() => {
        if (resetSearch) {
            setInputValue('');
            setSelectedValue(null);
            setShow(false);
            setResetSearch(false);
        }
    }, [resetSearch]);

    return (
        <Stack gap={2}>
            <Field label={title} errorText={errorText} invalid={!!errorText}>
                <Input
                    type={'search'}
                    py={5}
                    placeholder={'Busque por nome ou identificador'}
                    borderColor={{ base: 'gray.300', _dark: 'gray.800' }}
                    focusRingColor={{ base: 'brand.300', _dark: 'brand.400' }}
                    bg={{ base: 'white', _dark: 'inherit' }}
                    rounded={'md'}
                    fontSize={'16px'}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(ev) => handleKeyDown(ev)}
                    onBlur={onBlur}
                    value={inputValue}
                    autoComplete="off"
                />
            </Field>
            {show && (
                <Stack pos={'relative'}>
                    <Stack
                        pos={'absolute'}
                        bg={{ base: 'gray.100', _dark: 'gray.800' }}
                        top={0}
                        zIndex={900}
                        w="full"
                        gap={0}
                        rounded={'xl'}
                        maxH={'250px'}
                        css={customScrollbar}
                        overflowY={'auto'}
                    >
                        {isLoaded && suggestions && suggestions.length > 0 ? (
                            suggestions.map((suggestion) => (
                                <Stack
                                    key={suggestion.id}
                                    gap={0}
                                    cursor={'pointer'}
                                    onClick={() => handleSelect(suggestion)}
                                    _hover={{ bg: { base: 'gray.50', _dark: 'gray.700' } }}
                                    p={4}
                                >
                                    <Text fontSize={'sm'}>{suggestion.name}</Text>
                                    <Text fontSize={'xs'}>{suggestion.formattedIdentifier}</Text>
                                </Stack>
                            ))
                        ) : (
                            <Stack p={4}>
                                <Text>Nenhuma atividade encontrada</Text>
                            </Stack>
                        )}
                        {!isLoaded && (
                            <Stack w="full" minH="100px" align={'center'} justify={'center'}>
                                <Spinner size={'sm'} />
                                <Text fontSize={'sm'}>Buscando as atividades</Text>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}
