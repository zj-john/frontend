/**
 * fiber之前
 * 递归调用，执行栈会越来越深，而且不能中断，一旦中断想恢复就非常难了。
 */
let root = {
    key: 'A1',
    children: [
        {
            key: 'B1',
            children: [
                {
                    key: 'C1',
                    children: []
                },
                {
                    key: 'C2',
                    children: []
                }
            ]
        },
        {
            key: 'B2',
            children: []
        }
    ]
}

function walk(vdom) {
    doWork(vdom);
    vdom.children.forEach(child =>{
        walk(child);
    })
}

function doWork(vdom) {
    console.log(vdom.key);
}
walk(root);