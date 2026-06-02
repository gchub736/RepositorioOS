<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "System", description: "Endpoints de saúde e teste")]
#[OA\Get(
    path: "/api/teste",
    tags: ["System"],
    summary: "Endpoint público de teste",
    responses: [
        new OA\Response(response: 200, description: "API funcionando")
    ]
)]
#[OA\Get(
    path: "/api/health",
    tags: ["System"],
    summary: "Healthcheck da API",
    responses: [
        new OA\Response(response: 200, description: "Serviço e DB conectados"),
        new OA\Response(response: 500, description: "Erro no healthcheck")
    ]
)]
class Health {}
