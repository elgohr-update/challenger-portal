import axios from 'axios';
import React, { DependencyList } from 'react';

import { getData } from '../store/api';
import { DataActionDispatcherContext, DataStateContext } from '../store/contexts';

import faoAreasUrl from '../files/fao_areas.geojson';

export const useStationDetails = (stationName?: string): StationDetails | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsObject } = React.useContext(DataStateContext);
    const [stationDetails, setStationDetails] = React.useState<StationDetails | null>(null);

    React.useEffect(() => {
        if (stationName) {
            if (stationsObject[stationName]) {
                setStationDetails(stationsObject[stationName]);
            } else {
                getData<StationDetails>(
                    `stations/${stationName}`,
                    (data) => {
                        data.species.sort((a, b) => {
                            return a.matched_canonical_full_name.localeCompare(b.matched_canonical_full_name);
                        });
                        setStationDetails(data);
                        dataActionDispatcher({ type: 'updateStationDetails', station: data });
                    },
                    () => undefined
                );
            }
        }
    }, [stationName]);

    return stationDetails;
};

export const useSpeciesDetails = (speciesId?: string): SpeciesDetails | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { allSpeciesObject } = React.useContext(DataStateContext);
    const [speciesDetails, setSpeciesDetails] = React.useState<SpeciesDetails | null>(null);

    React.useEffect(() => {
        if (speciesId) {
            if (allSpeciesObject[speciesId]) {
                setSpeciesDetails(allSpeciesObject[speciesId]);
            } else {
                getData<SpeciesDetails>(
                    `species/${speciesId}`,
                    (data) => {
                        setSpeciesDetails(data);
                        dataActionDispatcher({ type: 'updateSpeciesDetails', species: data });
                    },
                    () => undefined
                );
            }
        }
    }, [speciesId]);

    return speciesDetails;
};

export const useFAOAreas = (): FAOArea[] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { faoAreas } = React.useContext(DataStateContext);
    const [faoAreasData, setFAOAreasData] = React.useState<FAOArea[]>(faoAreas);

    React.useEffect(() => {
        if (!faoAreas.length) {
            axios
                .get(faoAreasUrl)
                .then((res) => {
                    const data = (
                        res.data.features.map(
                            ({
                                properties: { OCEAN, F_AREA, NAME_EN }
                            }: {
                                properties: { OCEAN: string; F_AREA: string; NAME_EN: string };
                            }) => ({
                                code: F_AREA,
                                name: NAME_EN,
                                ocean: OCEAN
                            })
                        ) as FAOArea[]
                    ).sort((a, b) => a.name.localeCompare(b.name));
                    setFAOAreasData(data);
                    dataActionDispatcher({
                        type: 'updateFAOAreas',
                        faoAreas: data
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, []);

    return faoAreasData;
};

export const usePagination = (data: SpeciesSummary[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const maxPage: number = Math.ceil(data.length / itemsPerPage);

    const currentData = () => {
        const begin = (currentPage - 1) * itemsPerPage;
        const end = begin + itemsPerPage;
        return data.slice(begin, end);
    };

    const next = () => {
        setCurrentPage((currPage) => Math.min(currPage + 1, maxPage));
    };

    const prev = () => {
        setCurrentPage((currPage) => Math.max(currPage - 1, 1));
    };

    const jump = (page: number) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(() => Math.min(pageNumber, maxPage));
    };

    return { next, prev, jump, currentData, currentPage, maxPage };
};

export const useDebounce = (callback: () => void, deps: DependencyList, delay?: number) => {
    // Based on https://stackoverflow.com/a/61127960/2074794
    React.useEffect(() => {
        const handler = setTimeout(() => callback(), delay);

        return () => clearTimeout(handler);
    }, [...(deps || []), Number.isNaN(delay) ? 0 : delay]);
};
