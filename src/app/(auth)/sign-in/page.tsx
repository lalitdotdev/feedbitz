"use client"

import { signIn, signOut, useSession } from 'next-auth/react'

import React from 'react'

const page = () => {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button className='bg-slate-400 rouned-sm p-2 text-white' onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button className='bg-slate-400 rouned-sm p-2 text-white' onClick={() => signIn()}>Sign in</button>
        </>
    )

}

export default page
