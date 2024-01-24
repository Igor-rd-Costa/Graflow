import { useForm } from "@inertiajs/react";
import InputLabel from "../InputLabel";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import TextInput from "../TextInput";
import { FormEvent } from "react";

type CreateProjectFromProps = {
    onCancel : () => void,
    onSubmit : () => void
}

export default function CreateProjectFrom({onCancel, onSubmit } : CreateProjectFromProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: ''
    });

    function submit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('project.store'));
        onSubmit();
    }

    return (
        <div className='fixed w-[20rem] border-[0.1rem] rounded-xl border-gray-400  
        h-[12rem] bg-white mx-[50%] my-[25%] -translate-x-2/4 -translate-y-2/4'>
            <h2 className='p-3 uppercase border-b-[0.1rem] border-gray-200 text-turquoise'>Create Project</h2>
            <form onSubmit={submit} className='pl-[2rem] pr-[2rem] pt-[1rem]'>
                <div>
                    <InputLabel htmlFor={'project-name'} value={'Project Name'}></InputLabel>
                    <TextInput id='project-name' name='project-name' type='text' 
                        className='h-8 mt-2 w-full' onChange={e => setData('name', e.target.value)}>
                    </TextInput>
                </div>
                <div className='mt-5 float-right'>
                    <SecondaryButton className='mr-3' onClick={onCancel}>Cancel</SecondaryButton>
                    <PrimaryButton>Create</PrimaryButton>
                </div>
            </form>
        </div>
    );
}