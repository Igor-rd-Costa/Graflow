import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/Types';
import { Head } from '@inertiajs/react';
import { Project } from '../Projects/Index';
import AssetExplorer from './Partials/AssetExplorer';
import ProjectService from '@/Services/ProjectService';
import { useEffect, useState } from 'react';
import ViewPort from './Partials/Viewport';
import Timeline from './Partials/Timeline';
import PrimaryButton from '@/Components/PrimaryButton';
import PropertiesPanel from './Partials/PropertiesPanel';
import GlobalEventsService from '@/Services/GlobalEventsService';
import axios from 'axios';
import { GfProjectFile } from '@/Types/Graflow/Project';

type ViewProps = {
    project: Project,
    auth: {user : User}
}

export type ProjectInfo = {
    id: number,
    name: string,
    file: GfProjectFile
}

export default function Index({project, auth } : ViewProps) {
    const [ isLoaded, SetIsLoaded ] = useState<boolean>(false);
    let name = "View";
    if (project) {
        name = project.name;
    }
    useEffect(() => {
        GlobalEventsService.Init();
        ProjectService.LoadProject(project).then(() => {
            SetIsLoaded(true);
        })
        .catch((error) => {
            console.error("Falied to load project %s:", project.name, error);
        });
    }, []);

    function ResetLayers() {
        ProjectService.ResetLayers();
    }

    function ResetAssets() {
        ProjectService.ResetAssets();
    }

    function TestTest() {
        axios.post(route('test'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='h-8 flex items-center pl-4 text-sm text-gray-600'>
                    Message
                </div>
            }>
            <Head title={name}/>
            <section className='h-[calc(100vh-65px-34px)] p-2 overflow-scroll turquoise-background
            grid grid-cols-[auto_8.5fr_1.5fr] grid-rows-[7.5fr_2.5fr] gap-2'>
                <AssetExplorer isLoaded={isLoaded}></AssetExplorer>
                <ViewPort></ViewPort>
                <PropertiesPanel></PropertiesPanel>
                <Timeline isLoaded={isLoaded}></Timeline>
                <div className='row-start-2 pl-6 pt-6 bg-white border border-gray-500 rounded'>
                    <PrimaryButton onClick={ResetLayers}>Reset Layers</PrimaryButton>
                    <br></br>
                    <PrimaryButton className='mt-2' onClick={ResetAssets}>Reset Assets</PrimaryButton>
                    <br></br>
                    <PrimaryButton className='mt-2' onClick={TestTest}>Test</PrimaryButton>
                </div>
            </section>
        </AuthenticatedLayout>)
}