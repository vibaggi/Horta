# nucleo

## Horta

O controlador cuida do sistema hidroponico.

<img src="/docs/imgs/esquemaRasp.png" width="800" title="Esquema físico do sistema hidropônico integrado com o raspberry">

O raspberry controlará uma bomba que leva água até um distribuidor com N válvulas de saida. Cada valvula controla a entrada de água de um nível da horta hidropônica (apelidada no código de berçario).

Após alimentar todos os berçarios com água, o sistema fica um tempo em repouso, e em seguida é aberto as válvulas de saida de todos os berçarios. A água volta para a caixa.

Há um rele para cada válvula de entrada, e um rele para todas as válvulas de saida. O raspberry ativa o rele que por sua vez ativa a respectiva válvula.
