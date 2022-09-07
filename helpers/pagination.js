module.exports = {
    pagination: (options) => {
        let outputHTML = '';
        if (options.hash.current === 1) {
            outputHTML += `<li class="page-item disabled"><a class="page-link" href="">First</a></li>`;
        } else {
            outputHTML += `<li class="page-item"><a class="page-link" href="?page=1">First</a></li>`;
        }
        let pageNum = Number((options.hash.current) > 5 ? Number(options.hash.current) - 3 : 1);
        if (pageNum != 1) {
            outputHTML += `<li class="page-item disabled"><a class="page-link" href="">...</a></li>`;
        }
        for (; pageNum <= (Number(options.hash.current) + 3) && pageNum <= options.hash.pages; pageNum++) {
            if (pageNum === options.hash.current) {
                outputHTML += `<li class="page-item active"><a class="page-link" href="">${pageNum}</a></li>`;

            } else {
                outputHTML += `<li class="page-item"><a class="page-link" href="?page=${pageNum}">${pageNum}</a></li>`;

            }
            if (pageNum == Number(options.hash.current) + 4 && pageNum < options.hash.pages ){
                outputHTML += `<li class="page-item disabled"><a class="page-link" href="">...</a></li>`;
            }
        } if(options.hash.current == options.hash.pages){
            outputHTML += `<li class="page-item disabled"><a class="page-link" href="">Last</a></li>`;

        }else{
            outputHTML += `<li class="page-item"><a class="page-link" href="?page${options.hash.pages}">Last</a></li>`;

        }

        return outputHTML;

    }
}