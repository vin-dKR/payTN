"use client"
import React from 'react'
import {Button} from "@repo/ui/components/ui/button"
import {signIn} from "next-auth/react"

const Appbar = () => {
	return(
	<div className="flex item-center justify-between ">
		<div>Paytn</div>
		<div>
			<Button onClick={() => signIn()}>Sign In</Button>
		</div>
	</div>
)
}

export default Appbar;
