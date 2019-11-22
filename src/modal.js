import { sleep } from './utility.js';

// Used to ensure no modal window conflicts
var modal = false;

export async function openModal(btn) {
	// Checking if modal already open that shouldn't be
	if ($('.modal').length != 0 && !modal) {
	    return false;
	}
	// Ensuring no modal conflicts
	if (modal) {
		let closed = await closeModal();
		if (!closed) return false;
	}
	modal = true;
	// Opening modal
	btn.click();
	await sleep(1000);
	return true;
}

export async function closeModal() {
	// Closing modal
	let closeBtn = $('.modal-close')[0];
	if (closeBtn !== undefined) {
		closeBtn.click();
		await sleep(50);
		modal = false;
		return true;
	} else {
		console.log("MODAL ERROR: Modal close button could not be found.");
		return false;
	}
}