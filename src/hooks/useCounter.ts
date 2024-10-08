import { $useEffect, $useSignal } from "reverui";


export default function $useCounter(initValue = 0) {

	const count = $useSignal(initValue);

	$useEffect(() => {
		console.log("Hook $useCounter")
	}, [])

	const incrementCount = () => {
		count.value++;
	};

	const decrementCount = () => {
		count.value--;
	};

	$useEffect(() => {
		console.log(`Count changed to`, count.value);
	}, [count]);

	return {count, incrementCount, decrementCount}
}
