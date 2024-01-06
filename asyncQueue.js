// const fakePromise = () =>
// 	new Promise((res, rej) => setTimeout(() => rej("Error!"), 5000));
//
// function Queue() {
// 	const tasks = [];
// 	let running = false;
//
// 	const run = async () => {
// 		const res = [];
// 		while (tasks.length) {
// 			const promise = tasks.shift();
// 			res.push(await promise());
// 			console.log("Task finished!");
// 		}
// 		return res;
// 	};
//
// 	const push = (task) => {
// 		tasks.push(task);
// 		if (!running) running = run();
// 		return running.finally(() => {
// 			running = undefined;
// 		});
// 	};
//
// 	return {
// 		push,
// 	};
// }
//
// const queue = Queue();
// const promise = fakePromise();
// queue.push(fakePromise);
// queue.push(fakePromise);
// queue.push(fakePromise);

// const addTask = (() => {
// 	let pending = Promise.resolve();
//
// 	const run = async (task) => {
// 		try {
// 			await pending;
// 		} finally {
// 			return task();
// 		}
// 	};
//
// 	return (task) => {
// 		pending = run(task);
// 		return pending;
// 	};
// })();
//
// const promise = fakePromise();
// addTask(fakePromise).then(console.log).catch(console.err);
// addTask(fakePromise).then(console.log).catch(console.err);
// addTask(fakePromise).then(console.log).catch(console.err);

function Device() {
	const queue = [];
	let running = false;

	async function run(fn, errorMsg, onSuccess) {
		queue.push([fn, errorMsg, onSuccess]);

		if (!running) {
			running = true;
			while (queue.length) {
				const [_fn, _errorMsg, _onSuccess] = queue.shift();
				try {
					const result = await _fn();
					if (_onSuccess) {
						_onSuccess(result);
					}
				} catch (e) {
					console.error(`${_errorMsg}: ${e}`);
				}
			}
			running = false;
		}
	}

	function connect() {
		run(
			() =>
				new Promise((res, rej) =>
					setTimeout(() => {
						rej(true);
					}, 5000),
				),
			"Couldn't connect",
			() => console.log("connect called!"),
		);
		return this;
	}

	function readCharacteristics() {
		run(
			() =>
				new Promise((res, rej) =>
					setTimeout(() => {
						rej(true);
					}, 5000),
				),
			"Couldn't read characteristics",
			() => console.log("readCharacteristics called!"),
		);
		return this;
	}

	function disconnect() {
		run(
			() =>
				new Promise((res, rej) =>
					setTimeout(() => {
						rej(true);
					}, 5000),
				),
			"Couldn't disconnect",
			() => console.log("disconnect called!"),
		);
		return this;
	}

	return {
		connect,
		readCharacteristics,
		disconnect,
	};
}

Device().connect().readCharacteristics().disconnect();
