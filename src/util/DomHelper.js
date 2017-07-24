

export const renderImageOnErrorPlaceholder = () => {
  const _errorImageWrppaer = document.createElement('div');
  _errorImageWrppaer.className = 'error_image_wrapper';
  const _errorImage = document.createElement('span');
  _errorImage.className = 'error_image svg_picture_1';
  _errorImageWrppaer.appendChild(_errorImage);
  return _errorImageWrppaer;
};
