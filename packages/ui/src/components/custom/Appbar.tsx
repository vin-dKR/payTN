import React from 'react'
import {Button} from "@repo/ui/components/ui/button"

const Appbar = () => {
	return(
	<div className="flex item-center justify-between ">
		<div>Paytn</div>
		<div>
			<Button>Sign In</Button>
		</div>
	</div>
)
}

export default Appbar;
