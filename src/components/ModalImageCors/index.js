import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import ModalImage from "react-modal-image";
import api from "../../services/api";
import { isRequestableMediaUrl, normalizeMediaUrl } from "../../utils/mediaUrl";

const useStyles = makeStyles(theme => ({
	messageMedia: {
		objectFit: "cover",
		width: 250,
		height: 200,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
}));

const ModalImageCors = ({ imageUrl }) => {
	const classes = useStyles();
	const [fetching, setFetching] = useState(true);
	const [blobUrl, setBlobUrl] = useState("");
	const safeImageUrl = normalizeMediaUrl(imageUrl);

	useEffect(() => {
		if (!safeImageUrl) {
			setFetching(false);
			return;
		}

		if (safeImageUrl.startsWith("blob:") || safeImageUrl.startsWith("data:")) {
			setBlobUrl(safeImageUrl);
			setFetching(false);
			return;
		}

		if (!isRequestableMediaUrl(safeImageUrl)) {
			setFetching(false);
			return;
		}

		const fetchImage = async () => {
			try {
				const { data, headers } = await api.get(safeImageUrl, {
					responseType: "blob",
				});
				const url = window.URL.createObjectURL(
					new Blob([data], { type: headers["content-type"] })
				);
				setBlobUrl(url);
			} catch (error) {
				setBlobUrl(safeImageUrl);
			} finally {
				setFetching(false);
			}
		};
		fetchImage();
	}, [safeImageUrl]);

	return (
		<ModalImage
			className={classes.messageMedia}
			smallSrcSet={fetching ? safeImageUrl || "" : blobUrl || safeImageUrl || ""}
			medium={fetching ? safeImageUrl || "" : blobUrl || safeImageUrl || ""}
			large={fetching ? safeImageUrl || "" : blobUrl || safeImageUrl || ""}
			alt="image"
		/>
	);
};

export default ModalImageCors;