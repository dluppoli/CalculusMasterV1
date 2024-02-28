export function pigreco(n)
{
    let cifre = [];
    let iter = generaCifre();
    for (let i = 0; i < n; i++) {
        if(i==1) cifre.push('.');
        cifre.push(iter.next().value);
    }
    
    return cifre.join('');
}

function * generaCifre() {
    //Riferimento paper https://www.cs.ox.ac.uk/people/jeremy.gibbons/publications/spigot.pdf
    //Algoritmo piG3 pag. 10

    let q = 1n;
    let r = 180n;
    let t = 60n;
    let i = 2n;
    let u = 0;
    let y = 0;

    while (true) {
        y = (q*(27n*i-12n)+5n*r) / (5n*t);
        yield Number(y);
        
        u = 3n*(3n*i+1n)*(3n*i+2n);
        r = 10n*u*(q*(5n*i-2n)+r-y*t)
        q = 10n*q*i*(2n*i-1n);
        t = t*u;
        i = i+1n;
    }
}