import style from "./UserMedia.module.css";

function LoadingMediaElem() {
	return (
		<div id="loadingCircle" class={style.circle}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

export default LoadingMediaElem;
