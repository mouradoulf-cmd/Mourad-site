/* NM Studio — real client reviews, shown only once there are any.
 *
 * The "Reviews" section on the homepage stays hidden until this array has
 * entries — never filled with invented quotes. Same rule as the videos/
 * social links in offers-config.js: empty means "not shown yet", not
 * "fake it". Add one object per real review as clients send them:
 *
 *   { name: "Owner or manager's name", business: "Restaurant / salon name",
 *     quote: "Their own words, kept short.", rating: 5 }
 *
 * rating is 1–5 (whole stars). Keep quotes to one or two sentences.
 */
window.NM_REVIEWS = [];
