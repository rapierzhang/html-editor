const utils = require('../server/utils');
const compMap = require('./component').compMap;

const defaultJs = item => {
    const { element, id, attr = {}, js = {}, others = {} } = item;
    const { fileName } = attr;
    const { onSucc = '', onErr = '' } = js;
    const {
        formId = '',
        keyValList,
        url = '',
        fetchType = 'post',
        contentType = 'application/json',
        apiList = [],
        apiText,
        apiValue,
        mapDataType = '',
        mapData = [],
        mapHtml = '',
        mapJs = '',
    } = others;
    const uid = utils.lineToUnderLine(id);
    const nid = id.replace(/-/g, '');

    switch (element) {
        case 'Swiper':
            return `
                new Swiper('.swiper-container', {
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                });
            `;
        case 'Select':
            const common = `
                /*------ select start ------*/
                const $${uid} = $('#${id}');
                const $${uid}_input = $('#${id}-input');
                const $${uid}_text = $('#${id}-text');
                const ${uid}_data = ${url ? `$${uid}_res_list` : JSON.stringify(keyValList)};
                const ${uid}_picker = new Picker({data: [${uid}_data]});
                $${uid}.on('click', () => ${uid}_picker.show());
                ${uid}_picker.on('picker.change', (index, selectedIndex) => console.log('change: ', index));
                ${uid}_picker.on('picker.valuechange', (selectedVal, selectedIndex) => {
                    console.log('select: ', selectedVal);
                    ${uid}_data.forEach(item => {
                        if (item.value === selectedVal[0]) {
                            $${uid}_text.text(item.text);
                            $${uid}_input.val(selectedVal[0]);
                        }
                    });
                });
                /*------ select end ------*/
            `;
            if (url) {
                return `
                    const $${uid}_url = '${url}';
                    const $${uid}_fetch_type = '${fetchType}';
                    const $${uid}_content_type = '${contentType}';
                    let $${uid}_res_list = [];
                    const $${uid}_config = {
                        header: {
                            'Content-Type': $${uid}_content_type,
                            'Access-Control-Max-Age': '2592000',
                        },
                    };
                    axios[$${uid}_fetch_type]($${uid}_url, $${uid}_config)
                        .then(res => res.data)
                        .then(res => {
                            const list = [res, ...${JSON.stringify(apiList)}].reduce((x, y) => x[y]);
                            list.forEach((item, idx) => {
                                const obj = {
                                    text: item['${apiText}'],
                                    value: item['${apiValue}'],
                                }
                                $${uid}_res_list.push(obj);
                            });
                            ${common}
                        })
                        .catch(err => {
                            console.error(222, err)
                        });
                `;
            } else {
                return common;
            }

        case 'Upload':
            return `
                /*------ upload start ------*/
                const $${uid} = $('#${id}');
                const $${uid}_file = $('#${id}-file');
                const $${uid}_url = $('#${id}-url');
                const $${uid}_img = $('#${id}-img');
                const $${uid}_box = $('#${id}-box');
                
                $${uid}.on('click', () => $${uid}_file[0].click())
    
                $${uid}_file.on('change', e => {
                    const url = $${uid}.attr('url');
                    const form_data = new FormData();
                    form_data.append('${fileName}', e.target.files[0]);
                    const config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    axios.post(url, form_data, config)
                        .then(res => res.data)
                        .then(res => {
                            const img_src = [res, ...${JSON.stringify(apiList)}].reduce((x, y) => x[y]);
                            $${uid}_url.val(img_src);
                            $${uid}_img.attr('src', img_src);
                            $${uid}_img.removeClass('none');
                            $${uid}_img.addClass('block');
                            $${uid}_box.addClass('none');
                            $${uid}_img.css({
                                maxWidth: $${uid}.offsetWidth + 'px',
                                maxHeight: $${uid}.offsetHeight + 'px',
                            });
                            ${onSucc}
                        })
                        .catch(err => {
                            ${onErr}
                        });
                });
                /*------ upload end ------*/
            `;
        case 'Form':
            return `
                /*------ form start ------*/
                function form_${uid}_submit() {
                    const url = '${url}';
                    const fetch_type = '${fetchType}';
                    const content_type = '${contentType}';
                    const data = {};
                    const item_list = $('#${id} [name]');
                    [...item_list].forEach(function(item) {
                        switch(item.type) {
                            case 'radio':
                                if (item.checked) data[item.name] = item.value;
                            break;
                            case 'checkbox':
                                if (!data[item.name]) data[item.name] = [];
                                if (item.checked) data[item.name].push(item.value);
                            break;
                            default:
                                data[item.name] = item.value;
                        }
                    });
                    
                    const config = {
                        header: {
                            'Content-Type': content_type,
                            'Access-Control-Max-Age': '2592000',
                        },
                    }
                    axios[fetch_type](url, data, config)
                        .then(res => res.data)
                        .then(res => {
                            ${onSucc}
                        })
                        .catch(err => {
                            ${onErr}
                        });
                }
                /*------ form end ------*/
            `;
        case 'Submit':
            return `
                $('#${id}').on('click', form_${utils.lineToUnderLine(formId)}_submit);
                `;
        case 'Map':
            let dataCtx = ``;
            const commonCode = `
                const $${nid} = $('#${id}');
                let ${nid}_list_ele = '';
                ${nid}_data.forEach(item => {
                    ${nid}_list_ele += \`${mapHtml}\`;
                });
                $${nid}.html(${nid}_list_ele);
            `;
            if (mapData.length > 0) {
                // 接口渲染请求
                if (mapDataType === 'interface') {
                    dataCtx = `
                        const $${nid}_url = '${url}';
                        const $${nid}_fetch_type = '${fetchType}';
                        const $${nid}_content_type = '${contentType}';
                        let ${nid}_data = [];\n
                        const $${nid}_config = {
                            header: {
                                'Content-Type': $${nid}_content_type,
                                'Access-Control-Max-Age': '2592000',
                            },
                        };
                        axios[$${nid}_fetch_type]($${nid}_url, $${nid}_config)
                            .then(res => res.data)
                            .then(res => {
                                ${nid}_data = [res, ...${JSON.stringify(apiList)}].reduce((x, y) => x[y]);
                                ${commonCode}
                            })
                            .catch(err => {
                                console.error(222, err)
                            });
                    `;
                } else {
                    // json渲染
                    dataCtx = `
                        const ${nid}_data = ${mapData.toString()};
                        ${commonCode}
                    `;
                }
                dataCtx += mapJs;
                return dataCtx;
            }
        default:
            return '';
    }
};

module.exports = defaultJs;
