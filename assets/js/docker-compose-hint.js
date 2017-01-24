// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    var WORD = /[\w$]+/, RANGE = 500;

    CodeMirror.registerHelper("hint", "anyword", function(editor, options) {
        var word = options && options.word || WORD;
        var range = options && options.range || RANGE;
        var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
        var end = cur.ch, start = end;
        while (start && word.test(curLine.charAt(start - 1))) --start;
        var curWord = start != end && curLine.slice(start, end);

        var composeSchema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "id": "config_schema_v3.0.json",
            "type": "object",
            "required": ["version"],

            "properties": {
                "version": {
                    "type": "string"
                },

                "services": {
                    "id": "#/properties/services",
                    "type": "object",
                    "patternProperties": {
                        "^[a-zA-Z0-9._-]+$": {
                            "$ref": "#/definitions/service"
                        }
                    },
                    "additionalProperties": false
                },

                "networks": {
                    "id": "#/properties/networks",
                    "type": "object",
                    "patternProperties": {
                        "^[a-zA-Z0-9._-]+$": {
                            "$ref": "#/definitions/network"
                        }
                    }
                },

                "volumes": {
                    "id": "#/properties/volumes",
                    "type": "object",
                    "patternProperties": {
                        "^[a-zA-Z0-9._-]+$": {
                            "$ref": "#/definitions/volume"
                        }
                    },
                    "additionalProperties": false
                }
            },

            "additionalProperties": false,

            "definitions": {

                "service": {
                    "id": "#/definitions/service",
                    "type": "object",

                    "properties": {
                        "deploy": {"$ref": "#/definitions/deployment"},
                        "build": {
                            "oneOf": [
                                {"type": "string"},
                                {
                                    "type": "object",
                                    "properties": {
                                        "context": {"type": "string"},
                                        "dockerfile": {"type": "string"},
                                        "args": {"$ref": "#/definitions/list_or_dict"}
                                    },
                                    "additionalProperties": false
                                }
                            ]
                        },
                        "cap_add": {"type": "array", "items": {"type": "string"}, "uniqueItems": true},
                        "cap_drop": {"type": "array", "items": {"type": "string"}, "uniqueItems": true},
                        "cgroup_parent": {"type": "string"},
                        "command": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"type": "string"}}
                            ]
                        },
                        "container_name": {"type": "string"},
                        "depends_on": {"$ref": "#/definitions/list_of_strings"},
                        "devices": {"type": "array", "items": {"type": "string"}, "uniqueItems": true},
                        "dns": {"$ref": "#/definitions/string_or_list"},
                        "dns_search": {"$ref": "#/definitions/string_or_list"},
                        "domainname": {"type": "string"},
                        "entrypoint": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"type": "string"}}
                            ]
                        },
                        "env_file": {"$ref": "#/definitions/string_or_list"},
                        "environment": {"$ref": "#/definitions/list_or_dict"},

                        "expose": {
                            "type": "array",
                            "items": {
                                "type": ["string", "number"],
                                "format": "expose"
                            },
                            "uniqueItems": true
                        },

                        "external_links": {"type": "array", "items": {"type": "string"}, "uniqueItems": true},
                        "extra_hosts": {"$ref": "#/definitions/list_or_dict"},
                        "healthcheck": {"$ref": "#/definitions/healthcheck"},
                        "hostname": {"type": "string"},
                        "image": {"type": "string"},
                        "ipc": {"type": "string"},
                        "labels": {"$ref": "#/definitions/list_or_dict"},
                        "links": {"type": "array", "items": {"type": "string"}, "uniqueItems": true},

                        "logging": {
                            "type": "object",

                            "properties": {
                                "driver": {"type": "string"},
                                "options": {
                                    "type": "object",
                                    "patternProperties": {
                                        "^.+$": {"type": ["string", "number", "null"]}
                                    }
                                }
                            },
                            "additionalProperties": false
                        },

                        "mac_address": {"type": "string"},
                        "network_mode": {"type": "string"},

                        "networks": {
                            "oneOf": [
                                {"$ref": "#/definitions/list_of_strings"},
                                {
                                    "type": "object",
                                    "patternProperties": {
                                        "^[a-zA-Z0-9._-]+$": {
                                            "oneOf": [
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "aliases": {"$ref": "#/definitions/list_of_strings"},
                                                        "ipv4_address": {"type": "string"},
                                                        "ipv6_address": {"type": "string"}
                                                    },
                                                    "additionalProperties": false
                                                },
                                                {"type": "null"}
                                            ]
                                        }
                                    },
                                    "additionalProperties": false
                                }
                            ]
                        },
                        "pid": {"type": ["string", "null"]},

                        "ports": {
                            "type": "array",
                            "items": {
                                "type": ["string", "number"],
                                "format": "ports"
                            },
                            "uniqueItems": true
                        },

                        "privileged": {"type": "boolean"},
                        "read_only": {"type": "boolean"},
                        "restart": {"type": "string"},
                        "security_opt": {"type": "array", "items": {"type": "string"}, "uniqueItems": true},
                        "shm_size": {"type": ["number", "string"]},
                        "sysctls": {"$ref": "#/definitions/list_or_dict"},
                        "stdin_open": {"type": "boolean"},
                        "stop_grace_period": {"type": "string", "format": "duration"},
                        "stop_signal": {"type": "string"},
                        "tmpfs": {"$ref": "#/definitions/string_or_list"},
                        "tty": {"type": "boolean"},
                        "ulimits": {
                            "type": "object",
                            "patternProperties": {
                                "^[a-z]+$": {
                                    "oneOf": [
                                        {"type": "integer"},
                                        {
                                            "type":"object",
                                            "properties": {
                                                "hard": {"type": "integer"},
                                                "soft": {"type": "integer"}
                                            },
                                            "required": ["soft", "hard"],
                                            "additionalProperties": false
                                        }
                                    ]
                                }
                            }
                        },
                        "user": {"type": "string"},
                        "userns_mode": {"type": "string"},
                        "volumes": {"type": "array", "items": {"type": "string"}, "uniqueItems": true},
                        "working_dir": {"type": "string"}
                    },
                    "additionalProperties": false
                },

                "healthcheck": {
                    "id": "#/definitions/healthcheck",
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "disable": {"type": "boolean"},
                        "interval": {"type": "string"},
                        "retries": {"type": "number"},
                        "test": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"type": "string"}}
                            ]
                        },
                        "timeout": {"type": "string"}
                    }
                },
                "deployment": {
                    "id": "#/definitions/deployment",
                    "type": ["object", "null"],
                    "properties": {
                        "mode": {"type": "string"},
                        "replicas": {"type": "integer"},
                        "labels": {"$ref": "#/definitions/list_or_dict"},
                        "update_config": {
                            "type": "object",
                            "properties": {
                                "parallelism": {"type": "integer"},
                                "delay": {"type": "string", "format": "duration"},
                                "failure_action": {"type": "string"},
                                "monitor": {"type": "string", "format": "duration"},
                                "max_failure_ratio": {"type": "number"}
                            },
                            "additionalProperties": false
                        },
                        "resources": {
                            "type": "object",
                            "properties": {
                                "limits": {"$ref": "#/definitions/resource"},
                                "reservations": {"$ref": "#/definitions/resource"}
                            }
                        },
                        "restart_policy": {
                            "type": "object",
                            "properties": {
                                "condition": {"type": "string"},
                                "delay": {"type": "string", "format": "duration"},
                                "max_attempts": {"type": "integer"},
                                "window": {"type": "string", "format": "duration"}
                            },
                            "additionalProperties": false
                        },
                        "placement": {
                            "type": "object",
                            "properties": {
                                "constraints": {"type": "array", "items": {"type": "string"}}
                            },
                            "additionalProperties": false
                        }
                    },
                    "additionalProperties": false
                },

                "resource": {
                    "id": "#/definitions/resource",
                    "type": "object",
                    "properties": {
                        "cpus": {"type": "string"},
                        "memory": {"type": "string"}
                    },
                    "additionalProperties": false
                },

                "network": {
                    "id": "#/definitions/network",
                    "type": ["object", "null"],
                    "properties": {
                        "driver": {"type": "string"},
                        "driver_opts": {
                            "type": "object",
                            "patternProperties": {
                                "^.+$": {"type": ["string", "number"]}
                            }
                        },
                        "ipam": {
                            "type": "object",
                            "properties": {
                                "driver": {"type": "string"},
                                "config": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "subnet": {"type": "string"}
                                        },
                                        "additionalProperties": false
                                    }
                                }
                            },
                            "additionalProperties": false
                        },
                        "external": {
                            "type": ["boolean", "object"],
                            "properties": {
                                "name": {"type": "string"}
                            },
                            "additionalProperties": false
                        },
                        "labels": {"$ref": "#/definitions/list_or_dict"}
                    },
                    "additionalProperties": false
                },

                "volume": {
                    "id": "#/definitions/volume",
                    "type": ["object", "null"],
                    "properties": {
                        "driver": {"type": "string"},
                        "driver_opts": {
                            "type": "object",
                            "patternProperties": {
                                "^.+$": {"type": ["string", "number"]}
                            }
                        },
                        "external": {
                            "type": ["boolean", "object"],
                            "properties": {
                                "name": {"type": "string"}
                            },
                            "additionalProperties": false
                        },
                        "labels": {"$ref": "#/definitions/list_or_dict"}
                    },
                    "additionalProperties": false
                },

                "string_or_list": {
                    "oneOf": [
                        {"type": "string"},
                        {"$ref": "#/definitions/list_of_strings"}
                    ]
                },

                "list_of_strings": {
                    "type": "array",
                    "items": {"type": "string"},
                    "uniqueItems": true
                },

                "list_or_dict": {
                    "oneOf": [
                        {
                            "type": "object",
                            "patternProperties": {
                                ".+": {
                                    "type": ["string", "number", "null"]
                                }
                            },
                            "additionalProperties": false
                        },
                        {"type": "array", "items": {"type": "string"}, "uniqueItems": true}
                    ]
                },

                "constraints": {
                    "service": {
                        "id": "#/definitions/constraints/service",
                        "anyOf": [
                            {"required": ["build"]},
                            {"required": ["image"]}
                        ],
                        "properties": {
                            "build": {
                                "required": ["context"]
                            }
                        }
                    }
                }
            }
        };



        //TODO do something less dumb
        function _findWordInShema(compose,word){
            var l =[];

            for (var i in compose){
                if (i.startsWith(word)){
                    l.pushUnique(i);
                }
                if(typeof compose[i] === 'object') {
                    l = l.concatUnique(_findWordInShema(compose[i],word));
                }
            }
            return l ;

        }
        var list= _findWordInShema(composeSchema,curWord);
        var seen = {};
        var re = new RegExp(word.source, "g");
        for (var dir = -1; dir <= 1; dir += 2) {
            var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
            for (; line != endLine; line += dir) {
                var text = editor.getLine(line), m;
                while (m = re.exec(text)) {
                    if (line == cur.line && m[0] === curWord) continue;
                    if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
                        seen[m[0]] = true;
                        list.pushUnique(m[0]);
                    }
                }
            }
        }

        return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
    });
});
