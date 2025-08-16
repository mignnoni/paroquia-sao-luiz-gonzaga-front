import type { ICreateMassScheduleDTO } from '@/interfaces/ICreateMassScheduleDTO';
import type { IMassSchedule } from '@/interfaces/IMassSchedule';
import { massStore } from '@/stores/massStore';
import { useTempScheduleStore } from '@/stores/tempScheduleStore';
import { Card, Editable, HStack, IconButton, Stack, Text } from '@chakra-ui/react';
import { LuCheck, LuPencilLine, LuTrash, LuX } from 'react-icons/lu';
import { TempSchedule } from './temp-schedule';
import type { AxiosError, AxiosResponse } from 'axios';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { MassTimesCard } from '../Times/mass-times-card';

export function MassSchedulesSection() {
    const { massLocation, addMassSchedule, updateMassScheduleDay, removeMassSchedule } = massStore();
    const massSchedules = massLocation.massSchedules;

    const { resetTempSchedule } = useTempScheduleStore();

    const handleAddMassSchedule = async (schedule: ICreateMassScheduleDTO) => {
        try {
            const { data } = await api.post<ICreateMassScheduleDTO, AxiosResponse<IMassSchedule>>(
                `massLocations/${massLocation.id}/massSchedules`,
                schedule
            );

            addMassSchedule(data);
            resetTempSchedule();
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleRemoveMassSchedule = async (id: string) => {
        try {
            await api.delete(`massLocations/${massLocation.id}/massSchedules/${id}`);
            removeMassSchedule(id);
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    return (
        <Stack gap={4}>
            <TempSchedule onAdd={handleAddMassSchedule} />
            {massSchedules.length === 0 ? (
                <Card.Root>
                    <Card.Body>
                        <Text>Nenhuma programação adicionada</Text>
                    </Card.Body>
                </Card.Root>
            ) : (
                massSchedules.map((massSchedule, index) => (
                    <Card.Root key={index}>
                        <Card.Body>
                            <HStack justify={'space-between'}>
                                <Stack>
                                    <Editable.Root
                                        value={massSchedule.day}
                                        onValueChange={({ value }) => updateMassScheduleDay(massSchedule.id, value)}
                                        color={{ base: 'brand.600', _dark: 'brand.300' }}
                                        fontSize={'lg'}
                                        fontWeight={500}
                                    >
                                        <Editable.Preview w="full" />
                                        <Editable.Input />
                                        <Editable.Control>
                                            <Editable.EditTrigger asChild>
                                                <IconButton variant="ghost" size="xs">
                                                    <LuPencilLine />
                                                </IconButton>
                                            </Editable.EditTrigger>
                                            <Editable.CancelTrigger asChild>
                                                <IconButton variant="outline" size="xs">
                                                    <LuX />
                                                </IconButton>
                                            </Editable.CancelTrigger>
                                            <Editable.SubmitTrigger asChild>
                                                <IconButton variant="outline" size="xs">
                                                    <LuCheck />
                                                </IconButton>
                                            </Editable.SubmitTrigger>
                                        </Editable.Control>
                                    </Editable.Root>
                                    <MassTimesCard massScheduleId={massSchedule.id} />
                                </Stack>
                                <IconButton
                                    colorPalette={'red'}
                                    size={'xs'}
                                    onClick={() => handleRemoveMassSchedule(massSchedule.id)}
                                >
                                    <LuTrash />
                                </IconButton>
                            </HStack>
                        </Card.Body>
                    </Card.Root>
                ))
            )}
        </Stack>
    );
}
