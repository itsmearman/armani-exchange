import React from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

export default function OrderBox() {
    return (
        <div className='rounded-lg w-[45rem] h-[20rem]shadow-2xl mx-auto flex flex-row justify-evenly'>
            <div className='flex flex-col gap-4 '>
                <p className='text-gray-500 -mb-6 text-left text-[0.7rem] mt-2'>Avbl <span className='text-black text-[0.8rem]'>0.000000</span></p>
                <TextField
                    label="Price"
                    type="number"
                    variant="outlined"
                    inputProps={{
                        min: 0,        // Minimum value
                        max: 20,      // Maximum value
                        step: 0.01,       // Step size
                    }}
                    className='w-[20rem] mt-4'
                />
                <TextField
                    label="Amount"
                    type="number"
                    variant="outlined"
                    inputProps={{
                        min: 0,        // Minimum value
                        max: 20,      // Maximum value
                        step: 0.01,       // Step size
                    }}
                    className='w-[20rem] mt-4'
                />
                <TextField
                    label="Total"
                    type="number"
                    variant="outlined"
                    inputProps={{
                        min: 0,        // Minimum value
                        max: 20,      // Maximum value
                        step: 0.01,       // Step size
                    }}
                    className='w-[20rem] mt-4'
                />
                <Button className='rounded w-[20rem] bg-green-800 text-white'>buy</Button>
            </div>
            <div className='flex flex-col gap-4'>
            <p className='text-gray-500 -mb-6 text-left text-[0.7rem] mt-2'>Avbl <span className='text-black text-[0.8rem]'>0.000000</span></p>
                <TextField
                    label="Price"
                    type="number"
                    variant="outlined"
                    inputProps={{
                        min: 0,        // Minimum value
                        max: 20,      // Maximum value
                        step: 0.01,       // Step size
                    }}
                    className='w-[20rem] mt-4'
                />
                <TextField
                    label="Amount"
                    type="number"
                    variant="outlined"
                    inputProps={{
                        min: 0,        // Minimum value
                        max: 20,      // Maximum value
                        step: 0.01,       // Step size
                    }}
                    className='w-[20rem] mt-4'
                />
                <TextField
                    label="Total"
                    type="number"
                    variant="outlined"
                    inputProps={{
                        min: 0,        // Minimum value
                        max: 20,      // Maximum value
                        step: 0.01,       // Step size
                    }}
                    className='w-[20rem] mt-4'
                />
                <Button className='rounded w-[20rem] bg-red-500 text-white'>sell</Button>
            </div>
        </div>
    )
}
