import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";

const { Dragger } = Upload;

const DropArea: React.FC = (newProps) => (
	<Dragger
		name="file"
		multiple={false}
		action=""
		onChange={(e) => {
			console.log(e);
			if (e.file.status === "done") {
				console.log(e);
				const file = e.file.originFileObj as File;
				newProps.onDrop(file);
			}
		}}
	>
		<p className="ant-upload-drag-icon">
			<InboxOutlined />
		</p>
		<p className="ant-upload-text">Click or drag your passport here.</p>
		<p className="ant-upload-hint">Max. 50MB, PDF or PNG, JPG, JPEG</p>
	</Dragger>
);

export default DropArea;
