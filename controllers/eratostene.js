export function eratostene(n, soloPrimi)
{
    let valori = [];
    for(let i=0; i<=n;i++) valori.push({numero:i, primo:true});

    valori[0].primo = false;
    
    for(let i=2; i*i<=n; i++)
    {
        if(  valori[i].primo == true)
        {
            for(let j=i*2; j<=n; j+=i)
            {
                if( valori[j].primo == true && j%i == 0 ) valori[j].primo = false;
            }
        }
    }
    return valori.filter( v => v.numero>0 && (v.primo==soloPrimi || soloPrimi!=true))
}