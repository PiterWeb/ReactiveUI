import { $useEffect, $useSignal } from "reverui";

export default function Counter({ initialCount }: { initialCount?: number }) {
	const count = $useSignal(initialCount ?? 0);

	$useEffect(() => {
		console.log("ExampleStateFull mounted");
	}, []);

	const incrementCount = () => {
		count.value++;
	};

	const decrementCount = () => {
		count.value--;
	};

	$useEffect(() => {
		console.log(`Count changed to`, count.value);
	}, [count]);

	return (
		<div className="flex flex-col items-center rounded-lg p-6 max-w">
			<h2 className="text-2xl mb-8">Counter</h2>
			<div className="flex justify-center items-center bg-white rounded-full h-16 w-16 mb-8">
				<p className="text-2xl font-bold text-black">{count.value}</p>
			</div>
			<div className="flex justify-center items-center">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4"
					onclick={decrementCount}
				>
					-
				</button>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
					onclick={incrementCount}
				>
					+
				</button>
			</div>
		</div>
	);
}
