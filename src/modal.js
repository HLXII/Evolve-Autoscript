import { sleep } from './utility.js';

// Used to ensure no modal window conflicts
var modal = false;

export async function openModal(btn) {
	// Checking if modal already open
	if ($('.modal').length != 0) {
	    return false;
	}
	// Ensuring no modal conflicts
	if (modal) {return false;}
	modal = true;
	// Opening modal
	btn.click();
	await sleep(50);
	return true;
}

export async function closeModal() {
	// Closing modal
	let closeBtn = $('.modal-close')[0];
	if (closeBtn !== undefined) {closeBtn.click();}
	modal = false;
	await sleep(50);
}